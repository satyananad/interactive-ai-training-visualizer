export interface TrainingPoint {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface ChartPoint {
  epoch: number;
  loss?: number;
  accuracy?: number;
}

export type TrainingStatus =
  | "idle"
  | "loading"
  | "running"
  | "paused"
  | "completed"
  | "error";

