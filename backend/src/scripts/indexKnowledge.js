import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectMongo } from "../db/index.js";
import { getEmbedding } from "../services/embedding.service.js";
import { upsertChunks } from "../services/qdrant.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

async function indexKnowledge() {
  try {
    console.log("🚀 Starting knowledge base indexing process...");
    
    // Connect to MongoDB Atlas (for database fallback storage)
    await connectMongo();

    // Read JSON files from the data directory
    const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith(".json"));
    if (files.length === 0) {
      console.warn("⚠️ No knowledge JSON files found in data directory!");
      return;
    }

    const allChunks = [];

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      console.log(`📖 Reading knowledge file: ${file}...`);
      
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const records = JSON.parse(fileContent);

      if (!Array.isArray(records)) {
        console.warn(`⚠️ Warning: ${file} does not contain an array of records. Skipping.`);
        continue;
      }

      for (const record of records) {
        if (!record.title || !record.content) {
          console.warn(`⚠️ Warning: Record in ${file} is missing title or content. Skipping.`);
          continue;
        }

        // Generate embedding vector
        console.log(`📡 Generating embedding vector for chunk: "${record.title}"...`);
        const embedding = await getEmbedding(record.content);

        allChunks.push({
          title: record.title,
          content: record.content,
          source: file,
          embedding
        });
      }
    }

    if (allChunks.length === 0) {
      console.log("⚠️ No valid chunks to index.");
      return;
    }

    console.log(`📤 Upserting ${allChunks.length} chunks to knowledge databases...`);
    await upsertChunks(allChunks);

    console.log("🎉 Knowledge indexing completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Knowledge indexing failed:", err);
    process.exit(1);
  }
}

// Execute the indexing process
indexKnowledge();
