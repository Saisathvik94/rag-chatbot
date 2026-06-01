import { Router, Request, Response } from "express";
import { getVideoTranscript } from "../services/youtube";
import { ingestVideo } from "../services/rag";
import { ensureCollection } from "../services/db";
import { videoStore } from "../services/store";

const router = Router();

router.post("/video", async (req: Request, res: Response) => {
  const { url, videoLabel } = req.body;

  if (!url || !videoLabel) {
    res.status(400).json({ error: "url and videoLabel are required" });
    return;
  }

  if (videoLabel !== "A" && videoLabel !== "B") {
    res.status(400).json({ error: "videoLabel must be A or B" });
    return;
  }

  try {
    await ensureCollection();
    const video = await getVideoTranscript(url);
    await ingestVideo(video, videoLabel);
    
    // Store video in memory for analytics
    videoStore[videoLabel] = video;

    res.status(200).json({
      message: "Video ingested successfully",
      video: {
        videoId: video.videoId,
        title: video.title,
      },
    });
  } catch (error) {
    console.error("Ingest error:", error);
    res.status(500).json({ error: "Failed to ingest video" });
  }
});

export default router;