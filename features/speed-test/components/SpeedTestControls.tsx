"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { TestPhase } from "../types";

interface SpeedTestControlsProps {
  phase: TestPhase;
  progress: number;
  onStart: () => void;
  onReset: () => void;
}

const PHASE_LABELS: Record<TestPhase, string> = {
  idle: "Ready to test",
  ping: "Measuring ping...",
  download: "Testing download...",
  upload: "Testing upload...",
  done: "Test complete",
  error: "Test failed",
};

const PHASE_BADGE: Record<
  TestPhase,
  "default" | "secondary" | "destructive" | "outline"
> = {
  idle: "outline",
  ping: "secondary",
  download: "secondary",
  upload: "secondary",
  done: "default",
  error: "destructive",
};

const isRunning = (phase: TestPhase) =>
  phase === "ping" || phase === "download" || phase === "upload";

export function SpeedTestControls({
  phase,
  progress,
  onStart,
  onReset,
}: SpeedTestControlsProps) {
  const running = isRunning(phase);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <Badge
        variant={PHASE_BADGE[phase]}
        className="rounded-full px-4 py-1 text-xs capitalize"
      >
        {PHASE_LABELS[phase]}
      </Badge>

      {running && <Progress value={progress} className="h-1.5 w-full" />}

      <div className="flex items-center gap-3">
        {!running && phase !== "done" && (
          <Button
            size="lg"
            className="rounded-full w-40 h-12 font-semibold shadow-sm"
            onClick={onStart}
            disabled={running}
          >
            {running ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2 fill-current" />
            )}
            Start Test
          </Button>
        )}

        {(phase === "done" || phase === "error") && (
          <>
            <Button
              size="lg"
              className="rounded-full w-40 h-12 font-semibold shadow-sm"
              onClick={onStart}
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Test Again
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 hover:rotate-[-45deg] transition-transform"
              onClick={onReset}
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </Button>
          </>
        )}

        {running && (
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-40 h-12 font-semibold"
            onClick={onReset}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
