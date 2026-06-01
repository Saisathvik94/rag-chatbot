import "dotenv/config";
import express from "express";
import cors from "cors";
import videoRouter from "./routes/video";
import chatRouter from "./routes/chat";
import { ensureCollection } from "./services/db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", videoRouter);
app.use("/", chatRouter);

const PORT = process.env.PORT || 3000;
console.log("API KEY:", process.env.GOOGLE_API_KEY ? "loaded" : "missing")

async function start() {
    await ensureCollection();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

start();