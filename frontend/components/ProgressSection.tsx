"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface ProgressSectionProps {
  history: { epoch: number; loss: number; accuracy: number }[];
}

function ProgressSectionComponent({ history }: ProgressSectionProps) {
  const lastFive = history.slice(-6).reverse();

  return (
    <motion.div
      className="glass-panel neon-border flex flex-col gap-4 p-4 md:p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between text-sm">
        <h2 className="font-semibold text-slate-100">Training Timeline</h2>
        <span className="text-xs text-slate-400">Last few epochs</span>
      </div>

      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        Live signal
      </div>
      <div className="relative h-16 overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-60">
          <div className="h-full w-full bg-gradient-to-r from-cyan-500/20 via-violet-500/30 to-emerald-400/25 blur-3xl" />
        </div>
        <div className="relative z-10 flex h-full items-end gap-1 px-2">
          {lastFive.length === 0 ? (
            <span className="m-auto text-[11px] text-slate-400">
              Start training to see the signal evolve.
            </span>
          ) : (
            lastFive.map(point => {
              const normalizedLoss = Math.max(
                0.15,
                Math.min(1.1 - point.loss, 1)
              );
              const normalizedAcc = Math.max(
                0.2,
                Math.min(point.accuracy / 100, 1)
              );
              return (
                <motion.div
                  key={point.epoch}
                  className="flex-1 rounded-t-full bg-gradient-to-t from-emerald-400 via-cyan-400 to-violet-400"
                  initial={{ height: "5%" }}
                  animate={{
                    height: `${(normalizedAcc + normalizedLoss) * 40 + 10}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-auto text-[11px]">
        {lastFive.map(item => (
          <div
            key={item.epoch}
            className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-1.5"
          >
            <span className="text-slate-300">Epoch {item.epoch}</span>
            <span className="text-rose-300">
              L {item.loss.toFixed(3)}
            </span>
            <span className="text-emerald-300">
              A {item.accuracy.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export const ProgressSection = memo(ProgressSectionComponent);

