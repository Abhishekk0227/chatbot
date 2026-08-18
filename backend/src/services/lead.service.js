import { Submission } from "../db/models/submission.js";
import { sendSubmissionEmail } from "../lib/email.js";

/**
 * Update session extractedInfo and qualify lead when basic fields (name, phone) are present.
 */
export async function processLeadCapture(chatSession, newExtractedInfo) {
  const info = chatSession.extractedInfo || {
    name: null,
    phone: null,
    email: null,
    course: null,
    city: null,
    background: null
  };

  if (newExtractedInfo) {
    if (newExtractedInfo.name && !info.name) info.name = newExtractedInfo.name;
    if (newExtractedInfo.phone && !info.phone) info.phone = newExtractedInfo.phone;
    if (newExtractedInfo.email && !info.email) info.email = newExtractedInfo.email;
    if (newExtractedInfo.course && !info.course) info.course = newExtractedInfo.course;
    if (newExtractedInfo.city && !info.city) info.city = newExtractedInfo.city;
    if (newExtractedInfo.background && !info.background) info.background = newExtractedInfo.background;
  }

  // Set modified info
  chatSession.extractedInfo = info;

  // Regular expression double-check for phone and email if not extracted by LLM
  if (chatSession.messages && chatSession.messages.length > 0) {
    const lastMsg = chatSession.messages[chatSession.messages.length - 1]?.text || "";
    
    // Check phone number
    if (!info.phone) {
      const phoneMatch = lastMsg.match(/(\+91)?\s?[6-9]\d{9}/);
      if (phoneMatch) {
        info.phone = phoneMatch[0].trim();
      }
    }
    
    // Check email
    if (!info.email) {
      const emailMatch = lastMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        info.email = emailMatch[0].trim();
      }
    }
  }

  // Trigger qualification and backend form submission
  if (info.name && info.phone && !chatSession.qualified) {
    chatSession.qualified = true;
    
    try {
      console.log(`🎯 Lead Qualified! Name: ${info.name}, Phone: ${info.phone}. Submitting to database...`);
      
      const doc = await Submission.create({
        type: "chatbot_lead",
        name: info.name,
        phone: info.phone,
        email: info.email || "N/A",
        subject: "AI Chatbot Qualified Lead",
        program: info.course || "General Inquiry",
        message: `Qualified Lead from AI Chatbot. Profile Details:\n` +
                 `- City: ${info.city || "Not specified"}\n` +
                 `- Background: ${info.background || "Not specified"}`,
        read: false
      });
      
      console.log(`✅ Form submission saved successfully to DB, ID: ${doc._id}`);

      // Send SES email notification
      console.log("📧 Triggering email notification...");
      sendSubmissionEmail({
        type: "chatbot_lead",
        name: info.name,
        phone: info.phone,
        email: info.email || "N/A",
        subject: "AI Chatbot Qualified Lead",
        program: info.course || "General Inquiry",
        message: `Qualified Lead from AI Chatbot. Profile Details:\n` +
                 `- City: ${info.city || "Not specified"}\n` +
                 `- Background: ${info.background || "Not specified"}`,
      }).then((emailResult) => {
        console.log("📧 Email notification response:", emailResult);
      }).catch((err) => {
        console.error("❌ Failed to send email notification:", err);
      });

    } catch (err) {
      console.error("❌ Failed to save qualified lead to DB:", err);
    }
  }
}
