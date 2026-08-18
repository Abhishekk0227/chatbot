import { QdrantClient } from "@qdrant/js-client-rest";
import { KnowledgeChunk } from "../db/models/chunk.js";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const COLLECTION_NAME = "soaring_knowledge";

// Initialize Qdrant Client
let qdrantClient = null;
try {
  qdrantClient = new QdrantClient({ url: QDRANT_URL });
} catch (err) {
  console.warn("⚠️ Failed to initialize QdrantClient. Running in database fallback mode.");
}

/**
 * Initialize collection in Qdrant
 */
export async function initCollection() {
  if (!qdrantClient) return false;
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
    
    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 768,
          distance: "Cosine"
        }
      });
      console.log(`✅ Created Qdrant collection: ${COLLECTION_NAME}`);
    }
    return true;
  } catch (err) {
    console.warn("⚠️ Qdrant service is unreachable. Initializing in fallback mode.");
    return false;
  }
}

/**
 * Upsert points (chunks) to Qdrant or save to MongoDB
 */
export async function upsertChunks(chunks) {
  // Always save to MongoDB fallback database to ensure data parity
  console.log("💾 Saving chunks to MongoDB...");
  for (const chunk of chunks) {
    await KnowledgeChunk.updateOne(
      { title: chunk.title, source: chunk.source },
      {
        title: chunk.title,
        content: chunk.content,
        source: chunk.source,
        embedding: chunk.embedding
      },
      { upsert: true }
    );
  }

  // Try upserting to Qdrant
  if (!qdrantClient) return false;
  try {
    await initCollection();
    const points = chunks.map((chunk, idx) => ({
      id: idx + 1,
      vector: chunk.embedding,
      payload: {
        title: chunk.title,
        content: chunk.content,
        source: chunk.source
      }
    }));

    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points
    });
    console.log(`✅ Upserted ${chunks.length} points to Qdrant`);
    return true;
  } catch (err) {
    console.warn("⚠️ Failed to upsert to Qdrant. Chunks are saved in MongoDB.");
    return false;
  }
}

/**
 * Search Qdrant for top relevant chunks, falling back to local database cosine similarity
 */
export async function searchKnowledge(queryVector, limit = 5) {
  // 1. Try Qdrant search
  if (qdrantClient) {
    try {
      const results = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryVector,
        limit,
        with_payload: true
      });
      if (results && results.length > 0) {
        return results.map(item => ({
          title: item.payload.title,
          content: item.payload.content,
          source: item.payload.source,
          score: item.score
        }));
      }
    } catch (err) {
      // Qdrant search failed, silent fallback
    }
  }

  // 2. High-fidelity MongoDB Fallback using Cosine Similarity
  console.log("🔍 Searching knowledge base using MongoDB fallback...");
  try {
    const dbChunks = await KnowledgeChunk.find({});
    if (!dbChunks || dbChunks.length === 0) {
      return [];
    }

    const scored = dbChunks.map(chunk => {
      const score = cosineSimilarity(queryVector, chunk.embedding);
      return {
        title: chunk.title,
        content: chunk.content,
        source: chunk.source,
        score
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  } catch (err) {
    console.error("❌ Error during knowledge fallback search:", err);
    return [];
  }
}

/**
 * Math Helper: Cosine Similarity between two arrays
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
