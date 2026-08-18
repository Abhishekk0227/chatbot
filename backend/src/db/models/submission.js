import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["contact", "enrollment", "training", "chatbot_lead"],
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    subject: { type: String },
    program: { type: String },
    message: { type: String },
    read: { type: Boolean },
    status: { 
      type: String, 
      enum: ["new", "contacted", "callback", "closed", "junk"], 
      default: "new" 
    },
    notes: { type: String, default: "" },
    followUpDate: { type: Date },
    clientResponse: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Submission =
  mongoose.models["Submission"] ||
  mongoose.model("Submission", submissionSchema);
