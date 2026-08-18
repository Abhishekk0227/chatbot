import { logger } from "../lib/logger.js";

/**
 * Generate AI reply using local Ollama model (Qwen), falling back to Gemini API or a high-fidelity rule engine
 */
export async function generateResponse(systemInstruction, userQuery, history = []) {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const modelName = process.env.OLLAMA_MODEL || "qwen2.5:3b";

  // 1. Try local Ollama
  try {
    const formattedMessages = [
      { role: "system", content: systemInstruction }
    ];

    // Add conversation history
    if (Array.isArray(history)) {
      history.forEach(msg => {
        formattedMessages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text
        });
      });
    }

    // Add current query
    formattedMessages.push({ role: "user", content: userQuery });

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        messages: formattedMessages,
        format: "json",
        options: {
          temperature: 0.2
        },
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.message?.content;
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.reply) {
            return parsed;
          }
        } catch (jsonErr) {
          // If not valid JSON, encapsulate
          return {
            reply: rawText,
            intent: "general",
            action: "none",
            leadScoreIncrement: 5,
            suggestedQuestions: []
          };
        }
      }
    }
  } catch (err) {
    // Ollama not running, silent fallback
  }

  // 2. Fallback to Gemini 1.5 Flash API
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const contents = [];
      if (Array.isArray(history)) {
        history.forEach(msg => {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.text }]
          });
        });
      }
      contents.push({ role: "user", parts: [{ text: userQuery }] });

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          try {
            return JSON.parse(replyText);
          } catch (jsonErr) {
            return {
              reply: replyText,
              intent: "general",
              action: "none",
              leadScoreIncrement: 5,
              suggestedQuestions: []
            };
          }
        }
      }
    } catch (err) {
      logger.warn({ err }, "Gemini API fallback failed.");
    }
  }

  // 3. High-Fidelity Rule-Based Local Response Engine
  console.log("⚠️ Ollama and Gemini API are unavailable. Executing high-fidelity rule-based local chatbot parser.");
  return runLocalRuleEngine(userQuery);
}

/**
 * High-fidelity local rule parser (runs fully offline, zero-dependency)
 */
function runLocalRuleEngine(message) {
  const lowerMsg = message.toLowerCase();
  
  let reply = "";
  let intent = "general";
  let action = "none";
  let leadScoreIncrement = 0;
  let extractedInfo = {
    name: null,
    phone: null,
    email: null,
    course: null,
    city: null,
    background: null
  };
  let suggestedQuestions = [];

  // Simple Info Extraction
  const phoneMatch = message.match(/(\+91)?\s?[6-9]\d{9}/);
  if (phoneMatch) {
    extractedInfo.phone = phoneMatch[0].trim();
  }
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    extractedInfo.email = emailMatch[0];
  }
  
  // Extract Name (simple guess)
  if (lowerMsg.includes("my name is")) {
    const parts = lowerMsg.split("my name is");
    if (parts[1]) extractedInfo.name = parts[1].trim().split(" ")[0];
  } else if (lowerMsg.includes("mera naam")) {
    const parts = lowerMsg.split("mera naam");
    if (parts[1]) extractedInfo.name = parts[1].trim().split(" ")[0];
  }

  // Detect Intent & Action
  if (lowerMsg.includes("fee") || lowerMsg.includes("price") || lowerMsg.includes("fees") || lowerMsg.includes("charge")) {
    intent = "training";
    action = "scroll:training";
    leadScoreIncrement = 20;
    reply = "Soaring Aerotech offers top-tier **DGCA-approved Remote Pilot Training** in Indore.\n\n* **DGCA Small Class Rotorcraft Certificate:** ₹20,000 + GST.\n* **DGCA Multirotor Training:** ₹25,000 + GST.\n\nWould you like to register or apply for the upcoming batch?";
    suggestedQuestions = ["How to apply? 📝", "Check eligibility criteria 🎓"];
  } else if (lowerMsg.includes("apply") || lowerMsg.includes("enroll") || lowerMsg.includes("register") || lowerMsg.includes("admission") || lowerMsg.includes("join")) {
    intent = "training";
    action = "open:apply";
    leadScoreIncrement = 30;
    reply = "Excellent choice! I've opened the registration/enrollment form on the training page for you.\n\nCould you please share your **Name** and **Phone Number** so our training coordinator can confirm your seat?";
    suggestedQuestions = ["What documents are required? 📄", "Course duration details 📅"];
  } else if (lowerMsg.includes("eligible") || lowerMsg.includes("eligibility") || lowerMsg.includes("qualification") || lowerMsg.includes("document")) {
    intent = "training";
    action = "scroll:training";
    leadScoreIncrement = 15;
    reply = "To enroll in the DGCA drone pilot course, the requirements are:\n\n* **Age:** 18 to 65 years.\n* **Education:** 10th pass or ITI equivalent.\n* **Medical:** Fitness certificate from an MBBS doctor.\n* **Documents:** Aadhaar card, 10th Marksheet, and 4 passport photos.";
    suggestedQuestions = ["How much is the fee? 💰", "How many days is the course? 📅"];
  } else if (lowerMsg.includes("service") || lowerMsg.includes("survey") || lowerMsg.includes("map") || lowerMsg.includes("solar") || lowerMsg.includes("inspect")) {
    intent = "services";
    action = "scroll:services";
    leadScoreIncrement = 15;
    reply = "We offer professional B2B Drone Services with high-precision outputs:\n\n* **Aerial Survey & Mapping:** Centimetre-level accuracy (±2cm) for NHAI and MPRDC road projects.\n* **Solar Plant Inspection:** Thermal hotspot detection with zero grid downtime.\n* **Precision Agriculture:** NDVI crop health mapping and spraying.\n\nWould you like our business team to call you for a proposal?";
    suggestedQuestions = ["Request Call for Services 📞", "View our projects gallery 📸"];
  } else if (lowerMsg.includes("contact") || lowerMsg.includes("call") || lowerMsg.includes("phone") || lowerMsg.includes("number") || lowerMsg.includes("address") || lowerMsg.includes("office") || lowerMsg.includes("location") || lowerMsg.includes("where")) {
    intent = "contact";
    action = "scroll:contact";
    leadScoreIncrement = 15;
    reply = "You can connect with us directly:\n\n* **Phone:** +91 78699 18736 (Primary), +91 78699 55418\n* **Email:** info@soaringaerotech.com\n* **Office:** AIC-Prestige Inspire Foundation, Prestige Vihar, Scheme 74C, Vijay Nagar, Indore, MP.\n\nI have scrolled to the contact section for you.";
    suggestedQuestions = ["WhatsApp Us 💬", "Ask about Drone Courses 🎓"];
  } else if (lowerMsg.includes("gallery") || lowerMsg.includes("photo") || lowerMsg.includes("video") || lowerMsg.includes("image") || lowerMsg.includes("media")) {
    intent = "general";
    action = "scroll:gallery";
    reply = "Sure! I have scrolled to our media gallery page where you can see real-world photos of our training sessions, client demonstrations, and NHAI project operations.";
    suggestedQuestions = ["Tell me about directors 👥", "View Drone Services 🚀"];
  } else if (lowerMsg.includes("about") || lowerMsg.includes("company") || lowerMsg.includes("prestige") || lowerMsg.includes("director") || lowerMsg.includes("himanshu") || lowerMsg.includes("manoj")) {
    intent = "general";
    action = "scroll:about";
    reply = "Soaring Aerotech Pvt. Ltd. is Central India's complete drone ecosystem under Mr. Himanshu Jain and Dr. Manojkumar Deshpande. We have a 50,000 sq ft facility in Indore for UAV manufacturing and R&D.\n\nWould you like to know about our courses or services?";
    suggestedQuestions = ["Drone Courses 🎓", "Drone Services 🚀"];
  } else {
    reply = "I'm the Soaring Assistant, your AI Sales Copilot. I can help you enroll in our DGCA pilot courses, book drone B2B services, or coordinate a call with our team.\n\nWhat are you interested in today?";
    suggestedQuestions = ["Drone Courses & Fees 🎓", "Contact Details 📞", "Industrial Services 🚀"];
  }

  return {
    reply,
    intent,
    action,
    leadScoreIncrement,
    extractedInfo,
    suggestedQuestions
  };
}
