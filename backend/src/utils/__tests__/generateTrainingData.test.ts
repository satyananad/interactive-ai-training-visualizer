import { generateTrainingData } from "../generateTrainingData";

describe("generateTrainingData", () => {
  it("returns array of length equal to epochs", () => {
    const data = generateTrainingData(10, 0.01);
    expect(data).toHaveLength(10);
  });

  it("each item has epoch, loss, and accuracy", () => {
    const data = generateTrainingData(5, 0.01);
    data.forEach((point, i) => {
      expect(point).toHaveProperty("epoch", i + 1);
      expect(point).toHaveProperty("loss");
      expect(point).toHaveProperty("accuracy");
      expect(typeof point.loss).toBe("number");
      expect(typeof point.accuracy).toBe("number");
    });
  });

  it("clamps epochs to safe range", () => {
    const data = generateTrainingData(1000, 0.01);
    expect(data.length).toBeLessThanOrEqual(500);
  });

  it("supports batch size as a simulation parameter", () => {
    const lowBatch = generateTrainingData(12, 0.01, 8);
    const highBatch = generateTrainingData(12, 0.01, 1024);

    expect(lowBatch).toHaveLength(12);
    expect(highBatch).toHaveLength(12);

    lowBatch.forEach(point => {
      expect(point.loss).toBeGreaterThanOrEqual(0.02);
      expect(point.accuracy).toBeLessThanOrEqual(99.5);
    });
    highBatch.forEach(point => {
      expect(point.loss).toBeGreaterThanOrEqual(0.02);
      expect(point.accuracy).toBeLessThanOrEqual(99.5);
    });
  });
});
