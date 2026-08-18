
/**
 * Generate 768-dimensional embedding vector for a given text
 */
export async function getEmbedding(text) {
  const cleanText = text.replace(/\n/g, " ");

  // 1. Try local Ollama first
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  try {
    const response = await fetch(`${ollamaUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: cleanText
      })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.embedding && data.embedding.length === 768) {
        return data.embedding;
      }
    }
  } catch (err) {
    // Ollama not running or model not found, silent fallback
  }

  // 2. Try Gemini API next
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`;
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text: cleanText }] }
        })
      });
      if (response.ok) {
        const data = await response.json();
        const embedding = data.embedding?.values;
        if (embedding && embedding.length > 0) {
          // Adjust dimension to 768 if needed
          if (embedding.length === 768) {
            return embedding;
          }
          // Pad or slice to standard 768 dimension
          const fixedVector = new Array(768).fill(0);
          for (let i = 0; i < 768; i++) {
            fixedVector[i] = embedding[i] || 0;
          }
          return fixedVector;
        }
      }
    } catch (err) {
      // Gemini embedding failed, fallback
    }
  }

  // 3. High-Fidelity Offline Hashing Trick Fallback
  return generateOfflineEmbedding(cleanText);
}

/**
 * Robust offline fallback using the Hashing Trick
 */
function generateOfflineEmbedding(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const vector = new Array(768).fill(0);

  words.forEach(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0; 
    }
    const idx = Math.abs(hash) % 768;
    vector[idx] += 1;
  });

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < 768; i++) {
      vector[i] /= magnitude;
    }
  }
  return vector;
}
