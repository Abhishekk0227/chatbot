import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    leadScore: { type: Number, default: 0 },
    extractedInfo: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      course: { type: String, default: null },
      city: { type: String, default: null },
      background: { type: String, default: null }
    },
    qualified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ChatSession =
  mongoose.models["ChatSession"] ||
  mongoose.model("ChatSession", chatSessionSchema);
