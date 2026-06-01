import { GoogleGenerativeAI } from "@google/generative-ai";
import { client, COLLECTION_NAME } from "./db";
import { RetrievedChunk } from "../types/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const embeddingModel = genAI.getGenerativeModel({
  model: "models/gemini-embedding-001",
});

async function embedQuery(question: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(question);

  return result.embedding.values;
}

export async function retrieveChunks(
  question: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  console.log("Retrieving chunks for:", question);

  const queryVector = await embedQuery(question);

  const results = await client.search(COLLECTION_NAME, {
    vector: queryVector,
    limit: topK,
    with_payload: true,
  });

  console.log(
    "Search scores:",
    results.map((r) => r.score)
  );

  const chunks = results.map((hit) => {
    const payload = hit.payload as Record<string, unknown>;

    return {
      videoId: String(payload.videoId ?? ""),
      videoLabel: payload.videoLabel as "A" | "B",

      title: String(payload.title ?? ""),
      channelName: String(payload.channelName ?? ""),
      subscriberCount: Number(payload.subscriberCount ?? 0),

      views: Number(payload.views ?? 0),
      likes: Number(payload.likes ?? 0),
      comments: Number(payload.comments ?? 0),

      hookText: String(payload.hookText ?? ""),

      chunkIndex: Number(payload.chunkIndex ?? 0),
      content: String(payload.content ?? ""),

      score: hit.score ?? 0,
    };
  });

  console.log("Retrieved chunks:", chunks.length);

  return chunks;
}