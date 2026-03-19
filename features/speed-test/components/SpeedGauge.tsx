"use client";

import { cn } from "@/lib/utils";
import { TestPhase } from "../types";

interface SpeedGaugeProps {
  value: number;
  max?: number;
  unit?: string;
  label: string;
  phase: TestPhase;
  active: boolean;
}

export function SpeedGauge({
  value,
  max = 100,
  unit = "Mbps",
  label,
  phase,
  active,
}: SpeedGaugeProps) {
  const SIZE = 200;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  // Arc spans 240° (from 150° to 390°)
  const ARC = (240 / 360) * CIRCUMFERENCE;
  const clamped = Math.min(value, max);
  const filled = (clamped / max) * ARC;
  const offset = CIRCUMFERENCE - filled;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-[210deg]"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC} ${CIRCUMFERENCE - ARC}`}
            strokeLinecap="round"
            className="text-muted/40"
          />
          {/* Progress */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
            strokeDashoffset={CIRCUMFERENCE - ARC}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-300 ease-out",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span
            className={cn(
              "text-4xl font-black tabular-nums tracking-tight transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {value > 0 ? value.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {unit}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
