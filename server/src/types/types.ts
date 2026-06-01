export interface TranscriptSegment {
  text: string
  start: number
  duration: number
}

export interface YoutubeVideo {
  videoId: string
  title: string
  transcript: string
  segments: TranscriptSegment[]
}

export interface Chunk {
  videoId: string
  videoLabel: "A" | "B"
  chunkIndex: number
  content: string
  startTime?: number
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
  videoId: string
  videoLabel: "A" | "B"
  chunkIndex: number
  content: string
  score: number
}