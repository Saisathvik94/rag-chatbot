import {  TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export async function chunkTranscript(transcript: string): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ["\n\n", "\n", ". ", "? ", "! ", " "],
  });

  const chunks = await splitter.createDocuments([transcript]);

  return chunks;
}


export async function generateEmbeddings(chunks: Document[]): Promise<number[][]> {

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-embedding-001",  
        taskType: TaskType.RETRIEVAL_DOCUMENT, 
    })
    const documentEmbeddings = await embeddings.embedDocuments(chunks.map(c => c.pageContent))

    return documentEmbeddings
}