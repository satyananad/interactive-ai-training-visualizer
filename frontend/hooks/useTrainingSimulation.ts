"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { TrainingPoint, ChartPoint, TrainingStatus } from "../lib/types";

interface UseTrainingSimulationOptions {
  epochs: number;
  learningRate: number;
  batchSize: number;
  speedMs: number;
  onSeriesReset?: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://interactive-ai-training-visualizer-1.onrender.com";

export function useTrainingSimulation({
  epochs,
  learningRate,
  batchSize,
  speedMs,
  onSeriesReset
}: UseTrainingSimulationOptions) {
  const [status, setStatus] = useState<TrainingStatus>("idle");
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentLoss, setCurrentLoss] = useState<number | null>(null);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [lossSeries, setLossSeries] = useState<ChartPoint[]>([]);
  const [accuracySeries, setAccuracySeries] = useState<ChartPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fullDataRef = useRef<TrainingPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetState = useCallback(() => {
    clearTimer();
    fullDataRef.current = [];
    indexRef.current = 0;
    setCurrentEpoch(0);
    setCurrentLoss(null);
    setCurrentAccuracy(null);
    setProgress(0);
    setLossSeries([]);
    setAccuracySeries([]);
    setError(null);
    setStatus("idle");
    onSeriesReset?.();
  }, [onSeriesReset]);

  const streamData = useCallback((speed: number) => {
    clearTimer();
    if (!fullDataRef.current.length) return;

    setStatus("running");
    intervalRef.current = setInterval(() => {
      const i = indexRef.current;
      const data = fullDataRef.current;

      if (i >= data.length) {
        clearTimer();
        setStatus("completed");
        return;
      }

      const point = data[i];
      indexRef.current = i + 1;

      setCurrentEpoch(point.epoch);
      setCurrentLoss(point.loss);
      setCurrentAccuracy(point.accuracy);
      setProgress(Math.round(((i + 1) / data.length) * 100));

      setLossSeries(prev => [
        ...prev,
        { epoch: point.epoch, loss: point.loss }
      ]);
      setAccuracySeries(prev => [
        ...prev,
        { epoch: point.epoch, accuracy: point.accuracy }
      ]);
    }, Math.max(60, speed));
  }, []);

  const fetchTrainingData = useCallback(async () => {
    const maxRetries = 2;
    let delayMs = 450;
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/train`, {
          params: { epochs, learningRate, batchSize },
          timeout: 2000
        });
        const dataset = response.data?.data as TrainingPoint[] | undefined;
        if (!dataset || !Array.isArray(dataset)) {
          throw new Error("Invalid training response format.");
        }
        return dataset;
      } catch (err) {
        lastError = err;
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }

    throw lastError;
  }, [batchSize, epochs, learningRate]);

  const start = useCallback(async () => {
    if (status === "loading" || status === "running") return;

    resetState();
    setStatus("loading");
    try {
      const dataset = await fetchTrainingData();
      fullDataRef.current = dataset;
      indexRef.current = 0;

      if (!dataset.length) {
        setStatus("error");
        setError("No training data returned from server.");
        return;
      }

      streamData(speedMs);
    } catch (err: unknown) {
      console.error("Training API error", err);
      setStatus("error");
      if (axios.isAxiosError(err) && !err.response) {
        setError("Connection Failed: Backend server is not running.");
        } else {
          const serverError =
          axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : null;
          const fallback =
          err instanceof Error ? err.message : "Failed to fetch training data";
          setError(serverError ?? fallback);
          }
          setProgress(0);
        }
  }, [fetchTrainingData, resetState, speedMs, status, streamData]);

  const pause = useCallback(() => {
    if (status === "running") {
      clearTimer();
      setStatus("paused");
    }
  }, [status]);

  const resume = useCallback(() => {
    if (status === "paused" && fullDataRef.current.length) {
      streamData(speedMs);
    }
  }, [status, speedMs, streamData]);

  const step = useCallback(() => {
    if (status !== "paused" || !fullDataRef.current.length) return;
    const i = indexRef.current;
    const data = fullDataRef.current;
    if (i >= data.length) return;
    const point = data[i];
    indexRef.current = i + 1;
    setCurrentEpoch(point.epoch);
    setCurrentLoss(point.loss);
    setCurrentAccuracy(point.accuracy);
    setProgress(Math.round(((i + 1) / data.length) * 100));
    setLossSeries(prev => [...prev, { epoch: point.epoch, loss: point.loss }]);
    setAccuracySeries(prev => [
      ...prev,
      { epoch: point.epoch, accuracy: point.accuracy }
    ]);
    if (indexRef.current >= data.length) setStatus("completed");
  }, [status]);

  const updateSpeed = useCallback(
    (newSpeedMs: number) => {
      if (status === "running") {
        streamData(newSpeedMs);
      }
    },
    [status, streamData]
  );

  const manualReset = useCallback(() => {
    resetState();
  }, [resetState]);

  useEffect(
    () => () => {
      clearTimer();
    },
    []
  );

  const canStep =
    status === "paused" &&
    fullDataRef.current.length > 0 &&
    indexRef.current < fullDataRef.current.length;

  return {
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
    reset: manualReset,
    updateSpeed
  };
}
