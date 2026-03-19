export type TestPhase =
  | "idle"
  | "ping"
  | "download"
  | "upload"
  | "done"
  | "error";

export interface SpeedTestResult {
  ping: number; // ms
  jitter: number; // ms
  download: number; // Mbps
  upload: number; // Mbps
  timestamp: Date;
}

export interface SpeedTestState {
  phase: TestPhase;
  progress: number; // 0–100
  currentSpeed: number; // live Mbps during test
  result: SpeedTestResult | null;
  history: SpeedTestResult[];
  error: string | null;
}
