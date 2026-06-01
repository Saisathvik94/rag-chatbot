import { YouTubeTranscriptApi } from 'youtube-transcript-ts';
import { YoutubeVideo } from '../types/types';


function extractVideoId(url: string): string {
  const parsed = new URL(url);
  const videoId = parsed.searchParams.get("v")
  if (!videoId) throw new Error("No video ID found in URL");
  return videoId
}

export async function getVideoTranscript(videoUrl: string): Promise<YoutubeVideo> {

  const api = new YouTubeTranscriptApi();
  const response = await api.fetchTranscript(videoUrl);
  const transcript = response.transcript.snippets.map((snippet) => snippet.text).join(" ");

  return {
    videoId: extractVideoId(videoUrl),
    title: response.metadata.title,
    transcript,
    segments: response.transcript.snippets.map((snippet) => ({
      text: snippet.text,
      start: snippet.start,
      duration: snippet.duration,
    })),
  };
}

