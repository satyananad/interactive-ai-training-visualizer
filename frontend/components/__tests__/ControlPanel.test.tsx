import React from "react";
import { render, screen } from "@testing-library/react";
import { ControlPanel } from "../ControlPanel";

const defaultProps = {
  learningRate: 0.01,
  batchSize: 32,
  epochs: 100,
  speedMs: 220,
  status: "idle",
  onLearningRateChange: () => {},
  onBatchSizeChange: () => {},
  onEpochsChange: () => {},
  onSpeedChange: () => {},
  onStart: () => {},
  onPause: () => {},
  onResume: () => {},
  onStep: () => {},
  onReset: () => {},
  canStep: false
};

describe("ControlPanel", () => {
  it("renders training parameters title", () => {
    render(<ControlPanel {...defaultProps} />);
    expect(screen.getByText("Training Parameters")).toBeInTheDocument();
  });

  it("renders Start Training button", () => {
    render(<ControlPanel {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Start Training/i })).toBeInTheDocument();
  });

  it("renders Pause and Step buttons", () => {
    render(<ControlPanel {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Pause/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Step/i })).toBeInTheDocument();
  });
});
