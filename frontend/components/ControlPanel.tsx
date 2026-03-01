"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface ControlPanelProps {
  learningRate: number;
  batchSize: number;
  epochs: number;
  speedMs: number;
  status: string;
  onLearningRateChange: (v: number) => void;
  onBatchSizeChange: (v: number) => void;
  onEpochsChange: (v: number) => void;
  onSpeedChange: (v: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  canStep: boolean;
}

function ControlPanelComponent({
  learningRate,
  batchSize,
  epochs,
  speedMs,
  status,
  onLearningRateChange,
  onBatchSizeChange,
  onEpochsChange,
  onSpeedChange,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  canStep
}: ControlPanelProps) {
  const isRunning = status === "running";
  const isLoading = status === "loading";
  const isPaused = status === "paused";
  const showStop = isRunning || isLoading || isPaused;

  return (
    <motion.div
      className="glass-panel neon-border flex flex-col gap-4 p-5 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-wide text-slate-100">
          Training Parameters
        </h2>
        <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
          {status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="learning-rate"
            className="flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Learning Rate</span>
            <span className="text-cyan-300">{learningRate.toFixed(3)}</span>
          </label>
          <input
            id="learning-rate"
            type="range"
            min={0.001}
            max={0.2}
            step={0.001}
            value={learningRate}
            onChange={e => onLearningRateChange(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="batch-size" className="text-xs font-medium text-slate-300">
            Batch Size
          </label>
          <select
            id="batch-size"
            value={batchSize}
            onChange={e => onBatchSizeChange(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/60 transition focus:border-cyan-400 focus:ring"
          >
            {[16, 32, 64, 128].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="epochs"
            className="flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Epochs</span>
            <span className="text-violet-300">{epochs}</span>
          </label>
          <input
            id="epochs"
            type="range"
            min={10}
            max={200}
            step={10}
            value={epochs}
            onChange={e => onEpochsChange(parseInt(e.target.value, 10))}
            className="w-full accent-violet-400"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="playback-speed"
            className="flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Playback Speed</span>
            <span className="text-emerald-300">
              {(1000 / speedMs).toFixed(1)}x
            </span>
          </label>
          <input
            id="playback-speed"
            type="range"
            min={80}
            max={800}
            step={40}
            value={speedMs}
            onChange={e => onSpeedChange(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={onStart}
          disabled={isRunning || isLoading}
          className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Preparing..." : "Start Training"}
        </button>

        <button
          onClick={isPaused ? onResume : onPause}
          disabled={status === "idle" || status === "loading"}
          className="rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400 hover:text-rose-200"
        >
          {showStop ? "Stop" : "Reset"}
        </button>
      </div>
    </motion.div>
  );
}

export const ControlPanel = memo(ControlPanelComponent);
