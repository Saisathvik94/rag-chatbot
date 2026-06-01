import { RetrievedChunk } from "../types/types";

export function buildPrompt(
  question: string,
  chunks: RetrievedChunk[]
): string {
  const context = chunks
    .map(chunk => `
  Video: ${chunk.videoLabel}
  Title: ${chunk.title}
  Creator: ${chunk.channelName}
  Subscribers: ${chunk.subscriberCount}
  Views: ${chunk.views}
  Likes: ${chunk.likes}
  Comments: ${chunk.comments}
  Hook: ${chunk.hookText}

  Transcript:
  ${chunk.content}
`)
  .join("\n\n");

  return `
You are an expert YouTube Analytics Assistant. Your goal is to analyze YouTube videos based on the provided context.

Use the provided context to answer the user's questions, such as comparing videos, calculating engagement, analyzing hooks, identifying creators, and suggesting improvements.

Key Analytics Guidelines:
1. **Engagement Rate**: If asked, calculate it as ((Likes + Comments) / Views) * 100.
2. **Comparing Videos**: Contrast views, engagement rates, subscriber counts, and hook effectiveness.
3. **Hooks**: The 'Hook' section represents the crucial first 5 seconds. Compare these hooks directly when requested.
4. **Suggestions**: Provide actionable improvements for a video based on what succeeded in another (e.g., pacing, hook style, call to actions).

Cite sources as [Video Label] (e.g., [Video A] or [Video B]).
If the answer is not in the context, say:
"I couldn't find that in the provided videos."

Context:
${context}

Question:
${question}

Answer:
`;
}