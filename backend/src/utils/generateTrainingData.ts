export interface TrainingPoint {
  epoch: number;
  loss: number;
  accuracy: number;
}

export function generateTrainingData(
  epochs: number,
  learningRate: number,
  batchSize = 32
): TrainingPoint[] {
  const clampedEpochs = Math.max(1, Math.min(epochs, 500));
  const lr = Math.max(0.0001, Math.min(learningRate, 1));
  const clampedBatchSize = Math.max(8, Math.min(batchSize, 1024));
  const batchStability = Math.max(
    0.7,
    Math.min(Math.sqrt(clampedBatchSize / 32), 2.2)
  );

  return Array.from({ length: clampedEpochs }).map((_, i) => {
    const epoch = i + 1;

    const lrImpact = 0.6 + lr * 2.2;
    const baseLoss = 1 / (epoch * lrImpact);
    const lossNoise = (Math.random() * 0.06) / batchStability;
    const loss = Math.max(0.02, baseLoss + lossNoise);

    const baseAccuracy =
      48 + epoch * (1.2 + lr * 16) * (0.85 + batchStability * 0.15);
    const accuracyNoise = (Math.random() * 6) / batchStability;
    const accuracy = Math.min(99.5, baseAccuracy + accuracyNoise);

    return {
      epoch,
      loss: Number(loss.toFixed(3)),
      accuracy: Number(accuracy.toFixed(2))
    };
  });
}
