import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String, required: true },
    embedding: { type: [Number], required: true }
  },
  { timestamps: true }
);

export const KnowledgeChunk =
  mongoose.models["KnowledgeChunk"] ||
  mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
