"use client";

import { memo } from "react";

function SkeletonLoader() {
  return (
    <div className="glass-panel neon-border flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-40 animate-pulse rounded-full bg-slate-700/60" />
        <div className="h-3 w-56 animate-pulse rounded-full bg-slate-700/40" />
        <div className="mt-4 h-24 w-64 animate-pulse rounded-xl bg-slate-800/70" />
      </div>
    </div>
  );
}

export default memo(SkeletonLoader);

