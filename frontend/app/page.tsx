"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ControlPanel } from "../components/ControlPanel";
import { NeuralNetworkVisualizer } from "../components/NeuralNetworkVisualizer";
import { TrainingStats } from "../components/TrainingStats";
import { ProgressSection } from "../components/ProgressSection";
import SkeletonLoader from "../components/SkeletonLoader";
import { useTrainingSimulation } from "../hooks/useTrainingSimulation";
import { useTheme } from "../components/ThemeProvider";

const ChartPanel = dynamic(
  () => import("../components/ChartPanel").then(m => m.ChartPanel),
  {
    ssr: false,
    loading: () => <SkeletonLoader />
  }
);

const ThreeDModel = dynamic(
  () => import("../components/ThreeDModel").then(m => m.ThreeDModel),
  {
    ssr: false,
    loading: () => <SkeletonLoader />
  }
);

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(100);
  const [speedMs, setSpeedMs] = useState(220);

  const {
    status,
    error,
    currentEpoch,
    currentLoss,
    currentAccuracy,
    progress,
    lossSeries,
    accuracySeries,
    start,
    pause,
    resume,
    step,
    canStep,
    reset,
    updateSpeed
  } = useTrainingSimulation({
    epochs,
    learningRate,
    batchSize,
    speedMs,
    onSeriesReset: () => {}
  });

  const history = useMemo(
    () =>
      lossSeries.map((point, index) => ({
        epoch: point.epoch,
        loss: point.loss ?? 0,
        accuracy:
          accuracySeries[index]?.accuracy ??
          accuracySeries.at(-1)?.accuracy ??
          0
      })),
    [lossSeries, accuracySeries]
  );

  const handleSpeedChange = useCallback(
    (value: number) => {
      setSpeedMs(value);
      updateSpeed(value);
    },
    [updateSpeed]
  );

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-8 md:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
            Interactive AI Training Visualizer
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Simulate neural network training in real time. Adjust parameters,
            stream epoch updates, and explore animated 2D and 3D
            visualizations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-600/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-300 shadow-lg shadow-slate-900">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>Backend: http://localhost:4000/api/train</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="space-y-4 lg:col-span-3 xl:col-span-2">
          <ControlPanel
            learningRate={learningRate}
            batchSize={batchSize}
            epochs={epochs}
            speedMs={speedMs}
            status={status}
            onLearningRateChange={setLearningRate}
            onBatchSizeChange={setBatchSize}
            onEpochsChange={setEpochs}
            onSpeedChange={handleSpeedChange}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStep={step}
            onReset={reset}
            canStep={canStep}
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-7">
          <NeuralNetworkVisualizer
            currentLoss={currentLoss}
            status={status}
            currentEpoch={currentEpoch}
          />
        </div>

        <div className="space-y-4 lg:col-span-3 xl:col-span-3">
          <ChartPanel
            lossSeries={lossSeries}
            accuracySeries={accuracySeries}
          />
          <TrainingStats
            currentEpoch={currentEpoch}
            epochs={epochs}
            currentLoss={currentLoss}
            currentAccuracy={currentAccuracy}
            progress={progress}
            status={status}
          />
        </div>

        <div className="space-y-4 lg:col-span-8 xl:col-span-9">
          <ProgressSection history={history} />
        </div>

        <div className="space-y-4 lg:col-span-4 xl:col-span-3">
          <ThreeDModel />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-xs text-rose-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={start}
              className="rounded-md border border-rose-300/40 bg-rose-900/60 px-2.5 py-1 text-[11px] font-semibold text-rose-100 transition hover:border-rose-200 hover:bg-rose-900"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
