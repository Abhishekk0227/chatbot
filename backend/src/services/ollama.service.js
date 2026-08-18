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
      signal: AbortSignal.timeout(500),
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
    // Ollama not running or timed out, silent fallback
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
        signal: AbortSignal.timeout(5000),
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
 * Math Helper: Levenshtein Distance for typo matching
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Robust fuzzy matcher: handles typos, extra characters, and spelling variations across all domains
 */
export function fuzzyMatch(text, targetKeywords) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const words = normalized.split(/\s+/).filter(w => w.length >= 2);

  for (const word of words) {
    for (const keyword of targetKeywords) {
      // 1. Exact match
      if (word === keyword) return true;

      // 3-letter or shorter keywords require exact match (prevents "are" matching "age")
      if (keyword.length <= 3) continue;

      // 2. Substring match for keywords/words of 4+ characters with max length diff of 3 (prevents "what" matching "whatsapp")
      if (Math.abs(word.length - keyword.length) <= 3 && word.length >= 4 && keyword.length >= 4 && (word.includes(keyword) || keyword.includes(word))) {
        return true;
      }

      // 3. Precision Levenshtein Distance for typos (max 1 edit for words <=6 chars, 2 edits for longer)
      const allowedDist = keyword.length <= 6 ? 1 : 2;
      if (Math.abs(word.length - keyword.length) <= 1) {
        if (levenshteinDistance(word, keyword) <= allowedDist) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * High-fidelity local rule parser (runs fully offline, zero-dependency with typo tolerance)
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

  // Detect Intent & Action with Typo-Tolerance
  if (fuzzyMatch(lowerMsg, ["train", "traning", "traing", "course", "coarse", "corse", "pilot", "polot", "pilet", "learn", "rpto", "rpc", "multirotor", "rotorcraft", "duration"])) {
    intent = "training";
    action = "scroll:training";
    leadScoreIncrement = 20;
    reply = "**Soaring Aerotech Pvt. Ltd.** is Central India's premier drone ecosystem and Indore's first **DGCA-approved Remote Pilot Training Organization (RPTO)** (Authorisation No: 40/2023), incubated under **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n\n🎓 **DGCA Certified Courses:**\n* **DGCA Remote Pilot Certificate (RPC) - Small Class Rotorcraft:** ₹20,000 + GST.\n* **DGCA Multirotor Drone Training:** ₹25,000 + GST.\n* **Course Duration:** 5 to 7 Days (2 Days Theory + 3 Days Simulator & Practical Flying at our 50,000 sq ft Indore site).\n* **Certificate Validity:** **10 Years** valid across India.\n\n🛠️ **Advanced Skill Specializations:**\n* Drone Assembly & Maintenance Engineering\n* Aerial Mapping & GIS Surveying (Centimetre Accuracy)\n* Precision Agriculture & Crop Health Mapping (NDVI)\n* Thermal Inspection & Infrastructure Audits\n\n📋 **Eligibility Requirements:** 18–65 years old, 10th pass / ITI equivalent, medical fitness certificate from MBBS doctor.\n\nWould you like to register or check eligibility criteria?";
    suggestedQuestions = ["How to apply? 📝", "Check eligibility criteria 🎓", "Fees & Pricing 💰"];
  } else if (fuzzyMatch(lowerMsg, ["fee", "feess", "fees", "price", "priec", "cost", "costt", "charge", "charg", "rate", "rupee", "gst"])) {
    intent = "training";
    action = "scroll:training";
    leadScoreIncrement = 20;
    reply = "Here is the complete official fee structure for our **DGCA-approved Remote Pilot Training** in Indore:\n\n💰 **Course Fees Breakdown:**\n* **DGCA Small Class Rotorcraft Certificate (RPC):** ₹20,000 + GST / candidate.\n* **DGCA Multirotor Training:** ₹25,000 + GST / candidate.\n\n✨ **What is Included in the Fee:**\n* 5 to 7 days comprehensive training (Theory + Flight Simulator + Live Drone Flying).\n* Official DGCA Remote Pilot License/Certificate (Valid for 10 Years).\n* Training study kit, simulator software access, and flight logs.\n* Hands-on experience at our 50,000 sq ft flying field site in Indore.\n\nWould you like to register or check available batch dates?";
    suggestedQuestions = ["How to apply? 📝", "Check eligibility criteria 🎓"];
  } else if (fuzzyMatch(lowerMsg, ["apply", "aply", "enroll", "enrol", "register", "regster", "admission", "join"])) {
    intent = "training";
    action = "open:apply";
    leadScoreIncrement = 30;
    reply = "Excellent choice! I've opened the registration & enrollment form on the training page for you.\n\n📝 **Quick Registration Steps:**\n1. Fill in your **Full Name**, **Phone Number**, and **Email**.\n2. Select your preferred course (**Small Class RPC** or **Multirotor**).\n3. Our training coordinator will call you to confirm your batch seat and assist with document submission.\n\nCould you please share your **Name** and **Phone Number** here so I can register your seat immediately?";
    suggestedQuestions = ["What documents are required? 📄", "Course duration details 📅"];
  } else if (fuzzyMatch(lowerMsg, ["eligible", "elgible", "eligibility", "elgibility", "doc", "document", "documnt", "qualification", "qualifcation", "age", "medical", "mbbs", "aadhaar", "marksheet"])) {
    intent = "training";
    action = "scroll:training";
    leadScoreIncrement = 15;
    reply = "To enroll in our **DGCA Drone Pilot Training**, candidates must fulfill the following DGCA eligibility guidelines:\n\n📌 **Eligibility Criteria:**\n* **Age Limit:** Must be between 18 and 65 years old.\n* **Educational Qualification:** Passed 10th standard or ITI equivalent from a recognized board.\n* **Medical Fitness:** Medical fitness certificate issued by a registered MBBS doctor.\n\n📄 **Mandatory Documents Required:**\n1. Aadhaar Card / Voter ID / Passport / Driving License (Government Photo ID).\n2. 10th Standard Marksheet / Passing Certificate.\n3. MBBS Doctor Medical Fitness Certificate.\n4. 4 Passport-size photos.\n\nWould you like to know the course fees or apply for the upcoming batch?";
    suggestedQuestions = ["How much is the fee? 💰", "How many days is the course? 📅"];
  } else if (fuzzyMatch(lowerMsg, ["service", "servce", "servis", "survey", "surveyy", "map", "maping", "solar", "inspect", "inspectn", "agri", "agriculture", "ndvi", "thermal", "nhai", "mprdc"])) {
    intent = "services";
    action = "scroll:services";
    leadScoreIncrement = 15;
    reply = "**Soaring Aerotech** provides high-precision industrial B2B Drone Services with proven field execution across India:\n\n🛰️ **1. Aerial Surveying & 3D Mapping:**\n* Centimetre-accurate spatial data (±2cm precision).\n* 3D terrain modeling, contour mapping, & volume estimation for NHAI, MPRDC, & mining projects.\n\n⚡ **2. Solar Power Plant Thermal Inspection:**\n* High-resolution radiometric thermal cameras to detect micro-cracks, module hotspots, and string failures with zero grid downtime (450+ faults detected).\n\n🌾 **3. Precision Agriculture & Spraying:**\n* Multispectral NDVI sensor mapping for crop health analysis, disease detection, and targeted spraying.\n\n🌉 **4. Infrastructure & Structural Audits:**\n* High-rise visual inspection of bridges, mobile towers, chimneys, and wind turbines (5x faster, zero scaffolding risk).\n\nWould you like our business team to prepare a custom proposal for your project?";
    suggestedQuestions = ["Request Call for Services 📞", "View our projects gallery 📸"];
  } else if (fuzzyMatch(lowerMsg, ["manufac", "manufactur", "make", "lab", "facility", "facilitys", "sqft", "infrastructure", "r&d", "hardware", "assembly", "uav"])) {
    intent = "manufacturing";
    action = "scroll:about";
    leadScoreIncrement = 15;
    reply = "**Soaring Aerotech** operates Central India's premier UAV manufacturing and hardware innovation hub:\n\n🏢 **State-of-the-Art Infrastructure Details:**\n* **Campus Size:** 50,000 sq ft integrated facility located in Vijay Nagar, Indore.\n* **UAV Manufacturing Line:** In-house carbon fiber frame assembly, payload integration, & flight controller calibration.\n* **R&D Innovation Lab:** Hardware & software research lab incubated at **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n* **Flight Test Site:** Dedicated 50,000 sq ft open-air flying field for real-world drone testing and practical pilot training.\n\nWe design and manufacture specialized UAV frames, custom agricultural spraying drones, and mapping platforms.";
    suggestedQuestions = ["Drone Courses 🎓", "Industrial Services 🚀"];
  } else if (fuzzyMatch(lowerMsg, ["job", "jobs", "career", "carer", "vacancy", "vacanci", "intern", "internship", "hiring", "hire", "work", "cv", "resume"])) {
    intent = "career";
    action = "scroll:contact";
    leadScoreIncrement = 10;
    reply = "**Soaring Aerotech** is actively building the future of UAV technology and inviting passionate talent:\n\n💼 **Open Opportunity Domains:**\n* **UAV R&D & Hardware Engineers:** Flight controller, telemetry, & carbon-fiber frame design.\n* **DGCA Certified Drone Instructors & Remote Pilots:** Instructing future commercial drone pilots.\n* **Software Engineers:** Web apps, AI Copilots, & autonomous flight path software.\n* **Business Development Executives:** Enterprise B2B client acquisition.\n\n📩 **How to Apply:**\nSend your updated Resume / CV and Portfolio to **info@soaringaerotech.com** or **business@soaringaerotech.com**.";
    suggestedQuestions = ["Contact Us 📞", "Drone Courses 🎓"];
  } else if (fuzzyMatch(lowerMsg, ["director", "directr", "himanshu", "jain", "manoj", "deshpande", "prestige", "niti", "aayog", "aic", "incubat", "team", "engineer", "software", "harsh", "devendra", "alisha", "lalit", "aditya", "vaibhav", "abhishek"])) {
    intent = "general";
    action = "scroll:about";
    leadScoreIncrement = 10;
    reply = "**Soaring Aerotech Pvt. Ltd.** operates under expert leadership and a strong engineering team:\n\n👥 **Board of Directors:**\n* **Mr. Himanshu Jain** (Director) – Leading strategic UAV operations, manufacturing, and industry partnerships.\n* **Dr. Manojkumar Deshpande** (Director) – Guiding research initiatives, academic excellence, and DGCA compliance.\n\n🏛️ **Incubation & Legacy:**\nUnder the **Prestige Group** legacy, incubated at **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n\n🛠️ **Core Operational & Engineering Team:**\n* **Lalit Nagapurkar** (R&D Manager & Drone Instructor)\n* **Aditya Agrawal** (Accountable Manager & Drone Instructor)\n* **Vaibhav Sawarkar** (Business Development Executive)\n* **Abhishek Chourasiya** (R&D Engineer & Remote Pilot)\n* **Software Engineers:** Harsh Sahu, Devendra Singh Sengar, Ms. Alisha Batham.";
    suggestedQuestions = ["Drone Courses 🎓", "Industrial Services 🚀"];
  } else if (fuzzyMatch(lowerMsg, ["contact", "contct", "call", "phone", "phne", "number", "numbr", "email", "mail", "whatsapp", "address", "adress", "office", "ofice", "location", "locatin", "where", "indore", "vijay"])) {
    intent = "contact";
    action = "scroll:contact";
    leadScoreIncrement = 15;
    reply = "You can reach **Soaring Aerotech** through the following direct communication channels:\n\n📍 **Office Location & Address:**\nAIC-Prestige Inspire Foundation, Prestige Vihar, Sector-D, Scheme No 74C, Vijay Nagar, Indore, Madhya Pradesh 452010.\n\n📞 **Phone Contacts:**\n* Primary Helpline: **+91 78699 18736**\n* Support Line: **+91 78699 55418**\n\n📧 **Email Addresses:**\n* General Enquiries: **info@soaringaerotech.com**\n* Business Proposals: **business@soaringaerotech.com**\n\n💬 **WhatsApp Direct Chat:**\n[Click here to chat on WhatsApp (+91 78699 18736)](https://wa.me/917869918736)";
    suggestedQuestions = ["WhatsApp Us 💬", "Ask about Drone Courses 🎓"];
  } else if (fuzzyMatch(lowerMsg, ["gallery", "galery", "photo", "phto", "video", "image", "media", "picture", "pic"])) {
    intent = "general";
    action = "scroll:gallery";
    reply = "Sure! I have scrolled to our **Media & Gallery** section where you can view high-resolution photos and videos of:\n\n📸 Real-world DGCA practical flying sessions at our Indore flying ground.\n📸 NHAI & MPRDC highway aerial survey operations.\n📸 Solar power plant thermal inspection demonstrations.\n📸 UAV R&D manufacturing lab & flight simulator site.";
    suggestedQuestions = ["Tell me about directors 👥", "View Drone Services 🚀"];
  } else if (fuzzyMatch(lowerMsg, ["about", "abou", "company", "prestige", "director", "directr", "himanshu", "manoj"])) {
    intent = "general";
    action = "scroll:about";
    reply = "**Soaring Aerotech Pvt. Ltd.** is Central India's complete drone ecosystem operating under the leadership of Mr. Himanshu Jain and Dr. Manojkumar Deshpande. Incubated at **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**, we feature a 50,000 sq ft campus in Indore for UAV manufacturing, DGCA pilot training, and B2B industrial solutions.\n\nWould you like to know about our drone courses or industrial services?";
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
