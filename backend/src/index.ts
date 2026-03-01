import express from "express";
import cors from "cors";
import trainRoute from "./routes/train";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    credentials: false
  })
);

app.use(express.json());

app.use("/api", trainRoute);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Training API server running on :${PORT}`);
});

