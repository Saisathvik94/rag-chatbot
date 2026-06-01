import { Router, Request, Response } from "express";
import { retrieveChunks } from "../services/retrieval";
import { streamChat } from "../services/llm";
import { ChatRequest } from "../types/types";
import { videoStore } from "../services/store"; // in-memory video metadata
import { buildAnalyticsPrompt } from "../prompts/analytics";

const router = Router();

/**
 * Detect analytics / comparison questions
 */
function isAnalyticsQuestion(q: string) {
  const text = q.toLowerCase();

  return (
    text.includes("why") ||
    text.includes("compare") ||
    text.includes("difference") ||
    text.includes("better") ||
    text.includes("engagement") ||
    text.includes("improve") ||
    text.includes("analysis")
  );
}

router.post("/chat", async (req: Request, res: Response) => {
  const { question }: ChatRequest = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    let stream;
    if (isAnalyticsQuestion(question)) {
      const videoA = videoStore["A"];
      const videoB = videoStore["B"];

      if (!videoA || !videoB) {
        return res.status(400).json({
          error: "Videos not loaded for analytics",
        });
      }

      const prompt = buildAnalyticsPrompt(question, videoA, videoB);

      stream = await streamChat(prompt, []); // no RAG
    }

    else {
      const chunks = await retrieveChunks(question);

      stream = await streamChat(question, chunks);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const token of stream) {
      res.write(`${token}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error: "Failed to process chat",
    });
  }
});

export default router;