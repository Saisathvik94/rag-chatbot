import { GoogleGenerativeAI } from "@google/generative-ai";
import { RetrievedChunk } from "../types/types";
import { buildPrompt } from "../prompts/prompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function streamChat(
  question: string,
  chunks: RetrievedChunk[]
): Promise<AsyncIterable<string>> {
  const prompt = buildPrompt(question, chunks);

  const result = await model.generateContentStream(prompt);

  return (async function* () {
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  })();
}