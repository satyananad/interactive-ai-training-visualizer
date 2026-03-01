"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface TrainingStatsProps {
  currentEpoch: number;
  epochs: number;
  currentLoss: number | null;
  currentAccuracy: number | null;
  progress: number;
  status: string;
}

function TrainingStatsComponent({
  currentEpoch,
  epochs,
  currentLoss,
  currentAccuracy,
  progress,
  status
}: TrainingStatsProps) {
  return (
    <motion.div
      className="glass-panel neon-border flex flex-col gap-4 p-4 md:p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Training Progress
        </h2>
        <span className="text-xs text-slate-400">
          Epoch {currentEpoch || 0} / {epochs}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Overall progress</span>
          <span className="text-emerald-300">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900/80">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-orange-400 via-emerald-400 to-cyan-400"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: "easeOut", duration: 0.35 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl bg-slate-900/70 p-3">
          <div className="text-[11px] text-slate-400">Loss</div>
          <div className="mt-1 text-lg font-semibold text-rose-300">
            {currentLoss != null ? currentLoss.toFixed(3) : "--"}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-amber-400 to-rose-500"
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX:
                  currentLoss != null
                    ? Math.max(0.15, Math.min(1.2 - currentLoss, 1))
                    : 0
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3">
          <div className="text-[11px] text-slate-400">Accuracy</div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {currentAccuracy != null ? `${currentAccuracy.toFixed(1)}%` : "--"}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-sky-400 to-emerald-400"
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX:
                  currentAccuracy != null
                    ? Math.max(0.2, Math.min(currentAccuracy / 100, 1))
                    : 0
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3">
          <div className="text-[11px] text-slate-400">Status</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            {status}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const TrainingStats = memo(TrainingStatsComponent);

