import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeVideo } from "../types/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

function extractVideoId(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1];
    }

    const videoId = parsed.searchParams.get("v");

    if (!videoId) {
      throw new Error("Video ID not found");
    }

    return videoId;
  } catch {
    throw new Error(`Invalid YouTube URL: ${url}`);
  }
}

export async function getVideoTranscript(
  videoUrl: string
): Promise<YoutubeVideo> {
  const videoId = extractVideoId(videoUrl);

  console.log(`Fetching transcript for ${videoId}`);

  const transcriptList = await YoutubeTranscript.fetchTranscript(videoId);
  
  if (!transcriptList.length) {
    throw new Error("Transcript not available");
  }

  const transcript = transcriptList
    .map((segment) => segment.text)
    .join(" ");

  const hookText = transcriptList
    .filter((segment) => segment.offset <= 5)
    .map((segment) => segment.text)
    .join(" ");

  // Fetch video details
  const videoResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );

  if (!videoResponse.ok) {
    throw new Error("Failed to fetch YouTube video metadata");
  }

  const videoData = await videoResponse.json();

  if (!videoData.items?.length) {
    throw new Error("Video not found");
  }

  const video = videoData.items[0];

  const title = video.snippet.title;
  const channelName = video.snippet.channelTitle;
  const channelId = video.snippet.channelId;

  const views = Number(video.statistics.viewCount ?? 0);
  const likes = Number(video.statistics.likeCount ?? 0);
  const comments = Number(video.statistics.commentCount ?? 0);

  // Fetch channel details
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
  );

  let subscriberCount = 0;

  if (channelResponse.ok) {
    const channelData = await channelResponse.json();

    subscriberCount = Number(
      channelData.items?.[0]?.statistics?.subscriberCount ?? 0
    );
  }

  return {
    videoId,

    title,

    channelName,
    subscriberCount,

    views,
    likes,
    comments,

    hookText,

    transcript,

    segments: transcriptList.map((segment) => ({
      text: segment.text,
      start: segment.offset,
      duration: segment.duration,
    })),
  };
}