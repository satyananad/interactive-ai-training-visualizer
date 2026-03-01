"use client";

import { memo, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import type { ChartPoint } from "../lib/types";

interface ChartPanelProps {
  lossSeries: ChartPoint[];
  accuracySeries: ChartPoint[];
}

function ChartPanelComponent({ lossSeries, accuracySeries }: ChartPanelProps) {
  const mergedData = useMemo(() => {
    const map = new Map<number, ChartPoint>();
    lossSeries.forEach(p => {
      map.set(p.epoch, {
        ...(map.get(p.epoch) || {}),
        epoch: p.epoch,
        loss: p.loss
      });
    });
    accuracySeries.forEach(p => {
      map.set(p.epoch, {
        ...(map.get(p.epoch) || {}),
        epoch: p.epoch,
        accuracy: p.accuracy
      });
    });
    return Array.from(map.values()).sort((a, b) => a.epoch - b.epoch);
  }, [lossSeries, accuracySeries]);

  return (
    <div className="glass-panel neon-border h-80 p-4 md:p-6">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
        <span className="font-semibold">Loss &amp; Accuracy Over Epochs</span>
        <span className="text-slate-400">Streaming in real-time</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ top: 12, left: -20, right: 10, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="epoch"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="#f97373"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#4ade80"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(148,163,184,0.4)",
              borderRadius: 12
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="loss"
            stroke="#f97373"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="accuracy"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const ChartPanel = memo(ChartPanelComponent);

