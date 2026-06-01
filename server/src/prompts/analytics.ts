import { YoutubeVideo } from "../types/types";

export function buildAnalyticsPrompt(
  question: string,
  videoA: YoutubeVideo,
  videoB: YoutubeVideo
): string {
  const contextA = `
  [Video A]
  Title: ${videoA.title}
  Creator: ${videoA.channelName}
  Subscribers: ${videoA.subscriberCount}
  Views: ${videoA.views}
  Likes: ${videoA.likes}
  Comments: ${videoA.comments}
  Hook (First 5 seconds): ${videoA.hookText}
  
  Transcript:
  ${videoA.transcript}
  `;

  const contextB = `
  [Video B]
  Title: ${videoB.title}
  Creator: ${videoB.channelName}
  Subscribers: ${videoB.subscriberCount}
  Views: ${videoB.views}
  Likes: ${videoB.likes}
  Comments: ${videoB.comments}
  Hook (First 5 seconds): ${videoB.hookText}
  
  Transcript:
  ${videoB.transcript}
  `;

  return `
You are an expert YouTube Analytics Assistant. Your task is to perform an in-depth analysis of two competing videos based on the provided data.

You have access to the full metadata and transcripts for both Video A and Video B.
Answer the user's analytical questions by applying the following guidelines:
1. **Engagement Rate**: Calculate it as ((Likes + Comments) / Views) * 100.
2. **Comparing Videos**: Contrast views, engagement rates, subscriber counts, and transcript themes directly.
3. **Hooks**: Analyze the 'Hook' sections carefully to compare viewer retention strategies in the first 5 seconds.
4. **Suggestions**: Provide actionable improvements for a video based on what succeeded in another (e.g., pacing, hook style, call to actions).

Context for both videos:
${contextA}

${contextB}

Question:
${question}

Answer:
`;
}
