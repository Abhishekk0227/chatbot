import crypto from "crypto";
import { ChatSession } from "../db/models/chat.js";
import { getEmbedding } from "../services/embedding.service.js";
import { searchKnowledge } from "../services/qdrant.service.js";
import { buildPrompt } from "../services/prompt.service.js";
import { generateResponse } from "../services/ollama.service.js";
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

    // 1. Session Management (Phase 4)
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
    }

    let chatSession = await ChatSession.findOne({ sessionId: currentSessionId });
    if (!chatSession) {
      chatSession = new ChatSession({
        sessionId: currentSessionId,
        messages: [],
        leadScore: 0,
        extractedInfo: {
          name: null,
          phone: null,
          email: null,
          course: null,
          city: null,
          background: null
        },
        qualified: false
      });
    }

    // 2. Intent Detection (Phase 5 - Simple fast-path rule-based check)
    const lowerMsg = message.toLowerCase().trim();
    let immediateReply = null;
    let detectedIntent = "general";
    let immediateAction = "none";
    let scoreIncrement = 0;
    let suggestedQns = [];

    if (lowerMsg === "hi" || lowerMsg === "hello" || lowerMsg === "hey" || lowerMsg === "hola") {
      detectedIntent = "general";
      scoreIncrement = 0;
      immediateReply = "Hello! I am Soaring Assistant, your AI Sales Copilot. How can I assist you with our drone pilot courses or industrial drone services today?";
      suggestedQns = ["Drone Courses & Fees 🎓", "Industrial Services 🚀", "Contact Details 📞"];
    } else if (lowerMsg === "bye" || lowerMsg === "goodbye" || lowerMsg === "exit") {
      detectedIntent = "general";
      scoreIncrement = 0;
      immediateReply = "Goodbye! Have a great day. Feel free to chat with me anytime if you have more questions.";
      suggestedQns = ["Start new chat 🔄"];
    }

    // If fast path matched, save and return immediately (saves LLM/Embedding API calls)
    if (immediateReply) {
      // Append to session messages
      chatSession.messages.push({ role: "user", text: message });
      chatSession.messages.push({ role: "assistant", text: immediateReply });
      chatSession.leadScore = Math.min(100, chatSession.leadScore + scoreIncrement);
      
      await chatSession.save();

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

    // Process Lead Fields and Submission
    await processLeadCapture(chatSession, extracted);

    // Save Chat Session History (Phase 9)
    await chatSession.save();

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
