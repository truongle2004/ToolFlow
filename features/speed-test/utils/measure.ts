// Measures ping by timing a HEAD request to a small endpoint
export async function measurePing(
  samples = 8,
): Promise<{ ping: number; jitter: number }> {
  const times: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await fetch(`/api/speed-test/ping?t=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
    });
    times.push(performance.now() - start);
  }

  const ping = times.reduce((a, b) => a + b, 0) / times.length;
  const jitter =
    times.slice(1).reduce((acc, t, i) => acc + Math.abs(t - times[i]), 0) /
    (times.length - 1);

  return {
    ping: Math.round(ping),
    jitter: Math.round(jitter),
  };
}

// Measures download by fetching a blob and timing throughput
export async function measureDownload(
  onProgress: (mbps: number, progress: number) => void,
): Promise<number> {
  const FILE_SIZE_MB = 10;
  const url = `/api/speed-test/download?size=${FILE_SIZE_MB}&t=${Date.now()}`;
  const start = performance.now();

  const response = await fetch(url, { cache: "no-store" });
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  let received = 0;
  const totalBytes = FILE_SIZE_MB * 1024 * 1024;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    const elapsed = (performance.now() - start) / 1000;
    const mbps = (received * 8) / (elapsed * 1_000_000);
    onProgress(
      Math.round(mbps * 10) / 10,
      Math.min((received / totalBytes) * 100, 100),
    );
  }

  const elapsed = (performance.now() - start) / 1000;
  return Math.round(((received * 8) / (elapsed * 1_000_000)) * 10) / 10;
}

// Measures upload by POSTing a blob and timing throughput
export async function measureUpload(
  onProgress: (mbps: number, progress: number) => void,
): Promise<number> {
  const FILE_SIZE_MB = 5;
  const totalBytes = FILE_SIZE_MB * 1024 * 1024;
  const chunk = new Uint8Array(totalBytes);
  const blob = new Blob([chunk]);

  const start = performance.now();
  let uploaded = 0;
  const CHUNK_SIZE = 256 * 1024; // 256KB chunks

  while (uploaded < totalBytes) {
    const end = Math.min(uploaded + CHUNK_SIZE, totalBytes);
    const slice = blob.slice(uploaded, end);
    await fetch(`/api/speed-test/upload?t=${Date.now()}`, {
      method: "POST",
      body: slice,
      cache: "no-store",
    });
    uploaded = end;
    const elapsed = (performance.now() - start) / 1000;
    const mbps = (uploaded * 8) / (elapsed * 1_000_000);
    onProgress(
      Math.round(mbps * 10) / 10,
      Math.round((uploaded / totalBytes) * 100),
    );
  }

  const elapsed = (performance.now() - start) / 1000;
  return Math.round(((uploaded * 8) / (elapsed * 1_000_000)) * 10) / 10;
}
