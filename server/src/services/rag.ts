import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { client, COLLECTION_NAME } from "./db";
import { YoutubeVideo } from "../types/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

export async function chunkTranscript(transcript: string): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", ". ", "? ", "! ", " "],
  });

  const chunks = await splitter.createDocuments([transcript]);
  return chunks;
}

export async function generateEmbeddings(chunks: Document[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (const chunk of chunks) {
    const result = await embeddingModel.embedContent(chunk.pageContent);
    embeddings.push(result.embedding.values);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return embeddings;
}

export async function ingestVideo(
  video: YoutubeVideo,
  videoLabel: "A" | "B"
): Promise<void> {
  const chunks = await chunkTranscript(video.transcript);
  const embeddings = await generateEmbeddings(chunks);

  const points = chunks.map((chunk, index) => {
    return {
      id: crypto.randomUUID(),
      vector: embeddings[index],
      payload: {
        videoId: video.videoId,
        videoLabel,

        title: video.title,
        channelName: video.channelName,
        subscriberCount: video.subscriberCount,

        views: video.views,
        likes: video.likes,
        comments: video.comments,

        hookText: video.hookText,

        chunkIndex: index,
        content: chunk.pageContent,
      },
    };
  });

  await client.upsert(COLLECTION_NAME, { points });
}