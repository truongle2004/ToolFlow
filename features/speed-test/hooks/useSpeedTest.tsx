"use client";

import { useState, useCallback, useRef } from "react";
import { SpeedTestState, SpeedTestResult } from "../types";
import { measurePing, measureDownload, measureUpload } from "../utils/measure";

const INITIAL_STATE: SpeedTestState = {
  phase: "idle",
  progress: 0,
  currentSpeed: 0,
  result: null,
  history: [],
  error: null,
};

export function useSpeedTest() {
  const [state, setState] = useState<SpeedTestState>(INITIAL_STATE);
  const abortRef = useRef(false);

  const update = (patch: Partial<SpeedTestState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const run = useCallback(async () => {
    abortRef.current = false;
    update({
      phase: "ping",
      progress: 0,
      currentSpeed: 0,
      error: null,
      result: null,
    });

    try {
      // --- Ping ---
      const { ping, jitter } = await measurePing();
      if (abortRef.current) return;
      update({ phase: "download", progress: 0 });

      // --- Download ---
      let download = 0;
      download = await measureDownload((mbps, progress) => {
        update({ currentSpeed: mbps, progress });
      });
      if (abortRef.current) return;
      update({ phase: "upload", progress: 0, currentSpeed: 0 });

      // --- Upload ---
      let upload = 0;
      upload = await measureUpload((mbps, progress) => {
        update({ currentSpeed: mbps, progress });
      });
      if (abortRef.current) return;

      const result: SpeedTestResult = {
        ping,
        jitter,
        download,
        upload,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        phase: "done",
        progress: 100,
        currentSpeed: 0,
        result,
        history: [result, ...prev.history].slice(0, 5),
      }));
    } catch (e) {
      update({ phase: "error", error: "Test failed. Please try again." });
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState((prev) => ({ ...INITIAL_STATE, history: prev.history }));
  }, []);

  return { state, run, reset };
}
