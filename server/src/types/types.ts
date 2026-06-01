export interface TranscriptSegment {
  text: string
  start: number
  duration: number
}

export interface YoutubeVideo {
  videoId: string;
  title: string;

  channelName: string;
  subscriberCount: number;

  views: number;
  likes: number;
  comments: number;

  hookText: string;

  transcript: string;
  segments: TranscriptSegment[];
}


export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatRequest {
  question: string
  history: ChatMessage[]
}

export interface ChatResponse {
  answer: string
}

export interface RetrievedChunk {
  videoLabel: string,
  title: string,
  channelName: string,
  subscriberCount: number,
  views: number,
  likes: number,
  comments: number,
  hookText: string,
  content: string
}