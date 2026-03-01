import { Router, Request, Response } from "express";
import { generateTrainingData } from "../utils/generateTrainingData";

const router = Router();

router.get("/train", (req: Request, res: Response) => {
  try {
    const epochsRaw = req.query.epochs;
    const lrRaw = req.query.learningRate;
    const batchSizeRaw = req.query.batchSize;

    const epochs =
      typeof epochsRaw === "string" ? parseInt(epochsRaw, 10) || 10 : 10;
    const learningRate =
      typeof lrRaw === "string" ? parseFloat(lrRaw) || 0.01 : 0.01;
    const batchSize =
      typeof batchSizeRaw === "string"
        ? parseInt(batchSizeRaw, 10) || 32
        : 32;

    const data = generateTrainingData(epochs, learningRate, batchSize);

    res.json({
      params: { epochs, learningRate, batchSize },
      data
    });
  } catch (error) {
    console.error("Error in /api/train:", error);
    res.status(500).json({ error: "Failed to generate training data" });
  }
});

export default router;
