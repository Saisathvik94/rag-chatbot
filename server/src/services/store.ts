import { YoutubeVideo } from "../types/types";

// In-memory store for currently loaded videos for quick analytics
export const videoStore: Record<string, YoutubeVideo> = {};
