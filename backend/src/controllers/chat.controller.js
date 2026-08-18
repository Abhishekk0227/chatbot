import crypto from "crypto";
import mongoose from "mongoose";
import { ChatSession } from "../db/models/chat.js";
import { getEmbedding } from "../services/embedding.service.js";
import { searchKnowledge } from "../services/qdrant.service.js";
import { buildPrompt } from "../services/prompt.service.js";
import { generateResponse, fuzzyMatch } from "../services/ollama.service.js";
import { processLeadCapture } from "../services/lead.service.js";

/**
 * Handle incoming user chat request
 */
export async function handleUserChat(req, res) {
  try {
    const { message, sessionId, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    // 1. Session Management (Fault-Tolerant)
    let currentSessionId = sessionId || crypto.randomUUID();
    let chatSession = {
      sessionId: currentSessionId,
      messages: [],
      leadScore: 0,
      extractedInfo: { name: null, phone: null, email: null, course: null, city: null, background: null },
      qualified: false,
      save: async () => {}
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const dbSession = await ChatSession.findOne({ sessionId: currentSessionId }).maxTimeMS(2000);
        if (dbSession) {
          chatSession = dbSession;
        } else {
          chatSession = new ChatSession({
            sessionId: currentSessionId,
            messages: [],
            leadScore: 0,
            extractedInfo: { name: null, phone: null, email: null, course: null, city: null, background: null },
            qualified: false
          });
        }
      } catch (dbErr) {
        console.warn("⚠️ ChatSession DB query skipped (offline mode).");
      }
    }

    // 2. Intent Detection (Fast-path rule-based check for instant 0ms responses across ALL DOMAINS with typo tolerance)
    const lowerMsg = message.toLowerCase().trim();
    let immediateReply = null;
    let detectedIntent = "general";
    let immediateAction = "none";
    let scoreIncrement = 0;
    let suggestedQns = [];

    if (fuzzyMatch(lowerMsg, ["hi", "hello", "hey", "hola", "namaste", "hlo", "helo"])) {
      detectedIntent = "general";
      scoreIncrement = 0;
      immediateReply = "Hello! 🙏 Welcome to **Soaring Aerotech Pvt. Ltd.** – Central India's complete drone ecosystem.\n\nI am **AeroBot**, your AI Sales Copilot. I am here to guide you with:\n* 🎓 **DGCA Drone Pilot Training & Certifications** (RPC Small Class & Multirotor)\n* 🚀 **Industrial B2B Drone Services** (Aerial Mapping, Solar Inspection, Agriculture)\n* 🏭 **50,000 sq ft UAV Manufacturing & R&D Campus** in Indore\n* 📞 **Direct Contact & Registration Support**\n\nHow can I help you today?";
      suggestedQns = ["Drone Courses & Fees 🎓", "Industrial Services 🚀", "Contact Details 📞"];
    } else if (fuzzyMatch(lowerMsg, ["bye", "goodbye", "exit", "byy", "cya"])) {
      detectedIntent = "general";
      scoreIncrement = 0;
      immediateReply = "Thank you for reaching out to **Soaring Aerotech**! Have a fantastic day ahead. Feel free to chat with me anytime or call us at **+91 78699 18736** if you need further assistance.";
      suggestedQns = ["Start new chat 🔄"];
    } else if (fuzzyMatch(lowerMsg, ["job", "jobs", "career", "carer", "vacancy", "vacanci", "intern", "internship", "hiring", "hire", "work", "cv", "resume"])) {
      detectedIntent = "career";
      immediateAction = "scroll:contact";
      scoreIncrement = 10;
      immediateReply = "**Soaring Aerotech** is actively building the future of UAV technology and inviting passionate talent:\n\n💼 **Open Opportunity Domains:**\n* **UAV R&D & Hardware Engineers:** Flight controller, telemetry, & carbon-fiber frame design.\n* **DGCA Certified Drone Instructors & Remote Pilots:** Instructing future commercial drone pilots.\n* **Software Engineers:** Web apps, AI Copilots, & autonomous flight path software.\n* **Business Development Executives:** Enterprise B2B client acquisition.\n\n📩 **How to Apply:**\nSend your updated Resume / CV and Portfolio to **info@soaringaerotech.com** or **business@soaringaerotech.com**.";
      suggestedQns = ["Contact Us 📞", "Drone Courses 🎓"];
    } else if (fuzzyMatch(lowerMsg, ["director", "directors", "directr", "himanshu", "jain", "manoj", "deshpande", "prestige", "niti", "aayog", "aic", "incubat", "lalit", "aditya", "vaibhav", "abhishek", "engineer", "engineers"])) {
      detectedIntent = "general";
      immediateAction = "scroll:about";
      scoreIncrement = 10;
      immediateReply = "**Soaring Aerotech Pvt. Ltd.** operates under expert leadership and a strong engineering team:\n\n👥 **Board of Directors:**\n* **Mr. Himanshu Jain** (Director) – Leading strategic UAV operations, manufacturing, and industry partnerships.\n* **Dr. Manojkumar Deshpande** (Director) – Guiding research initiatives, academic excellence, and DGCA compliance.\n\n🏛️ **Incubation & Legacy:**\nUnder the **Prestige Group** legacy, incubated at **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n\n🛠️ **Core Operational & Engineering Team:**\n* **Lalit Nagapurkar** (R&D Manager & Drone Instructor)\n* **Aditya Agrawal** (Accountable Manager & Drone Instructor)\n* **Vaibhav Sawarkar** (Business Development Executive)\n* **Abhishek Chourasiya** (R&D Engineer & Remote Pilot)\n* **Software Engineers:** Harsh Sahu, Devendra Singh Sengar, Ms. Alisha Batham.";
      suggestedQns = ["Drone Courses 🎓", "Industrial Services 🚀"];
    } else if (fuzzyMatch(lowerMsg, ["contact", "contct", "call", "phone", "phne", "number", "numbr", "email", "mail", "whatsapp", "address", "adress", "office", "ofice", "location", "locatin", "where", "indore", "vijay"])) {
      detectedIntent = "contact";
      immediateAction = "scroll:contact";
      scoreIncrement = 15;
      immediateReply = "You can reach **Soaring Aerotech** through the following direct communication channels:\n\n📍 **Office Location & Address:**\nAIC-Prestige Inspire Foundation, Prestige Vihar, Sector-D, Scheme No 74C, Vijay Nagar, Indore, Madhya Pradesh 452010.\n\n📞 **Phone Contacts:**\n* Primary Helpline: **+91 78699 18736**\n* Support Line: **+91 78699 55418**\n\n📧 **Email Addresses:**\n* General Enquiries: **info@soaringaerotech.com**\n* Business Proposals: **business@soaringaerotech.com**\n\n💬 **WhatsApp Direct Chat:**\n[Click here to chat on WhatsApp (+91 78699 18736)](https://wa.me/917869918736)";
      suggestedQns = ["WhatsApp Us 💬", "Drone Courses & Fees 🎓"];
    } else if (fuzzyMatch(lowerMsg, ["fee", "feess", "fees", "price", "priec", "cost", "costt", "charge", "charg", "rate", "rupee", "gst"])) {
      detectedIntent = "training";
      immediateAction = "scroll:training";
      scoreIncrement = 20;
      immediateReply = "Here is the complete official fee structure for our **DGCA-approved Remote Pilot Training** in Indore:\n\n💰 **Course Fees Breakdown:**\n* **DGCA Small Class Rotorcraft Certificate (RPC):** ₹20,000 + GST / candidate.\n* **DGCA Multirotor Training:** ₹25,000 + GST / candidate.\n\n✨ **What is Included in the Fee:**\n* 5 to 7 days comprehensive training (Theory + Flight Simulator + Live Drone Flying).\n* Official DGCA Remote Pilot License/Certificate (Valid for 10 Years).\n* Training study kit, simulator software access, and flight logs.\n* Hands-on experience at our 50,000 sq ft flying field site in Indore.\n\nWould you like to register or check available batch dates?";
      suggestedQns = ["Apply Now 📝", "Check Eligibility Criteria 🎓", "Contact Details 📞"];
    } else if (fuzzyMatch(lowerMsg, ["apply", "aply", "enroll", "enrol", "register", "regster", "admission", "join"])) {
      detectedIntent = "training";
      immediateAction = "open:apply";
      scoreIncrement = 30;
      immediateReply = "Excellent choice! I've opened the registration & enrollment form on the training page for you.\n\n📝 **Quick Registration Steps:**\n1. Fill in your **Full Name**, **Phone Number**, and **Email**.\n2. Select your preferred course (**Small Class RPC** or **Multirotor**).\n3. Our training coordinator will call you to confirm your batch seat and assist with document submission.\n\nCould you please share your **Name** and **Phone Number** here so I can register your seat immediately?";
      suggestedQns = ["What documents are required? 📄", "Course duration details 📅"];
    } else if (fuzzyMatch(lowerMsg, ["eligible", "elgible", "eligibility", "elgibility", "doc", "document", "documnt", "qualification", "qualifcation", "medical", "mbbs", "aadhaar", "marksheet"])) {
      detectedIntent = "training";
      immediateAction = "scroll:training";
      scoreIncrement = 15;
      immediateReply = "To enroll in our **DGCA Drone Pilot Training**, candidates must fulfill the following DGCA eligibility guidelines:\n\n📌 **Eligibility Criteria:**\n* **Age Limit:** Must be between 18 and 65 years old.\n* **Educational Qualification:** Passed 10th standard or ITI equivalent from a recognized board.\n* **Medical Fitness:** Medical fitness certificate issued by a registered MBBS doctor.\n\n📄 **Mandatory Documents Required:**\n1. Aadhaar Card / Voter ID / Passport / Driving License (Government Photo ID).\n2. 10th Standard Marksheet / Passing Certificate.\n3. MBBS Doctor Medical Fitness Certificate.\n4. 4 Passport-size photos.\n\nWould you like to know the course fees or apply for the upcoming batch?";
      suggestedQns = ["How much is the fee? 💰", "Apply Now 📝"];
    } else if (fuzzyMatch(lowerMsg, ["service", "servce", "servis", "survey", "surveyy", "map", "maping", "solar", "inspect", "inspectn", "agri", "agriculture", "ndvi", "thermal", "nhai", "mprdc"])) {
      detectedIntent = "services";
      immediateAction = "scroll:services";
      scoreIncrement = 15;
      immediateReply = "**Soaring Aerotech** provides high-precision industrial B2B Drone Services with proven field execution across India:\n\n🛰️ **1. Aerial Surveying & 3D Mapping:**\n* Centimetre-accurate spatial data (±2cm precision).\n* 3D terrain modeling, contour mapping, & volume estimation for NHAI, MPRDC, & mining projects.\n\n⚡ **2. Solar Power Plant Thermal Inspection:**\n* High-resolution radiometric thermal cameras to detect micro-cracks, module hotspots, and string failures with zero grid downtime (450+ faults detected).\n\n🌾 **3. Precision Agriculture & Spraying:**\n* Multispectral NDVI sensor mapping for crop health analysis, disease detection, and targeted spraying.\n\n🌉 **4. Infrastructure & Structural Audits:**\n* High-rise visual inspection of bridges, mobile towers, chimneys, and wind turbines (5x faster, zero scaffolding risk).\n\nWould you like our business team to prepare a custom proposal for your project?";
      suggestedQns = ["Request Call for Services 📞", "View Projects Gallery 📸"];
    } else if (fuzzyMatch(lowerMsg, ["manufac", "manufactur", "make", "lab", "facility", "facilitys", "sqft", "campus", "r&d", "hardware", "assembly", "uav"])) {
      detectedIntent = "manufacturing";
      immediateAction = "scroll:about";
      scoreIncrement = 15;
      immediateReply = "**Soaring Aerotech** operates Central India's premier UAV manufacturing and hardware innovation hub:\n\n🏢 **State-of-the-Art Infrastructure Details:**\n* **Campus Size:** 50,000 sq ft integrated facility located in Vijay Nagar, Indore.\n* **UAV Manufacturing Line:** In-house carbon fiber frame assembly, payload integration, & flight controller calibration.\n* **R&D Innovation Lab:** Hardware & software research lab incubated at **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n* **Flight Test Site:** Dedicated 50,000 sq ft open-air flying field for real-world drone testing and practical pilot training.\n\nWe design and manufacture specialized UAV frames, custom agricultural spraying drones, and mapping platforms.";
      suggestedQns = ["Drone Courses 🎓", "Industrial Services 🚀"];
    } else if (fuzzyMatch(lowerMsg, ["train", "traning", "traing", "course", "coarse", "corse", "pilot", "polot", "pilet", "learn", "rpto", "rpc", "multirotor", "rotorcraft", "duration"])) {
      detectedIntent = "training";
      immediateAction = "scroll:training";
      scoreIncrement = 20;
      immediateReply = "**Soaring Aerotech Pvt. Ltd.** is Central India's premier drone ecosystem and Indore's first **DGCA-approved Remote Pilot Training Organization (RPTO)** (Authorisation No: 40/2023), incubated under **AIC-Prestige Inspire Foundation (NITI Aayog, Govt. of India)**.\n\n🎓 **DGCA Certified Courses:**\n* **DGCA Remote Pilot Certificate (RPC) - Small Class Rotorcraft:** ₹20,000 + GST.\n* **DGCA Multirotor Drone Training:** ₹25,000 + GST.\n* **Course Duration:** 5 to 7 Days (2 Days Theory + 3 Days Simulator & Practical Flying at our 50,000 sq ft Indore site).\n* **Certificate Validity:** **10 Years** valid across India.\n\n🛠️ **Advanced Skill Specializations:**\n* Drone Assembly & Maintenance Engineering\n* Aerial Mapping & GIS Surveying (Centimetre Accuracy)\n* Precision Agriculture & Crop Health Mapping (NDVI)\n* Thermal Inspection & Infrastructure Audits\n\n📋 **Eligibility Requirements:** 18–65 years old, 10th pass / ITI equivalent, medical fitness certificate from MBBS doctor.\n\nWould you like to register or check eligibility criteria?";
      suggestedQns = ["How to apply? 📝", "Check Eligibility Criteria 🎓", "Contact Details 📞"];
    } else if (fuzzyMatch(lowerMsg, ["gallery", "galery", "photo", "phto", "video", "image", "media", "picture", "pic"])) {
      detectedIntent = "general";
      immediateAction = "scroll:gallery";
      immediateReply = "Sure! I have scrolled to our **Media & Gallery** section where you can view high-resolution photos and videos of:\n\n📸 Real-world DGCA practical flying sessions at our Indore flying ground.\n📸 NHAI & MPRDC highway aerial survey operations.\n📸 Solar power plant thermal inspection demonstrations.\n📸 UAV R&D manufacturing lab & flight simulator site.";
      suggestedQns = ["Tell me about directors 👥", "View Drone Services 🚀"];
    }

    // If fast path matched, save and return immediately (saves LLM/Embedding API calls)
    if (immediateReply) {
      chatSession.messages.push({ role: "user", text: message });
      chatSession.messages.push({ role: "assistant", text: immediateReply });
      chatSession.leadScore = Math.min(100, chatSession.leadScore + scoreIncrement);
      
      try {
        if (typeof chatSession.save === "function") {
          await chatSession.save();
        }
      } catch (saveErr) {
        console.warn("⚠️ Failed to save chat session (offline mode).");
      }

      return res.json({
        success: true,
        sessionId: currentSessionId,
        reply: immediateReply,
        intent: detectedIntent,
        action: immediateAction,
        leadScore: chatSession.leadScore,
        qualified: chatSession.qualified,
        suggestedQuestions: suggestedQns
      });
    }

    // 3. Create Embedding (Phase 6)
    console.log(`📡 Generating embedding for user query: "${message}"...`);
    const queryVector = await getEmbedding(message);

    // 4. Search Vector Database (Phase 6 - Qdrant with DB fallback)
    console.log("🔍 Searching knowledge base vector chunks...");
    const relevantChunks = await searchKnowledge(queryVector, 5);

    // 5. Build prompt (Phase 7)
    console.log("📝 Constructing prompt context...");
    const systemPrompt = buildPrompt(relevantChunks, message);

    // 6. Call LLM (Phase 8 - Ollama Qwen with Gemini fallback)
    console.log("🤖 Generating response via AI engine...");
    const llmResponse = await generateResponse(systemPrompt, message, history || chatSession.messages);

    // Extract values returned by model
    const reply = llmResponse.reply || "I couldn't process your request.";
    const intent = llmResponse.intent || "general";
    const action = llmResponse.action || "none";
    const increment = Number(llmResponse.leadScoreIncrement) || 10;
    const extracted = llmResponse.extractedInfo || null;
    const suggestions = llmResponse.suggestedQuestions || [
      "Drone Courses & Fees 🎓",
      "Industrial Services 🚀"
    ];

    // 7. Update Session & Lead Engine (Phase 10 & 11)
    chatSession.messages.push({ role: "user", text: message });
    chatSession.messages.push({ role: "assistant", text: reply });
    
    // Update Lead Score
    chatSession.leadScore = Math.min(100, chatSession.leadScore + increment);

    try {
      // Process Lead Fields and Submission
      await processLeadCapture(chatSession, extracted);
      if (typeof chatSession.save === "function") {
        await chatSession.save();
      }
    } catch (saveErr) {
      console.warn("⚠️ Failed to process lead capture/session save (offline mode).");
    }

    // 8. Return Response
    return res.json({
      success: true,
      sessionId: currentSessionId,
      reply,
      intent,
      action,
      leadScore: chatSession.leadScore,
      qualified: chatSession.qualified,
      suggestedQuestions: suggestions
    });

  } catch (err) {
    console.error("❌ Error in chat controller:", err);
    res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
}
