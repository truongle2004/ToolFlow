export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mb = Math.min(Number(searchParams.get("size") ?? 10), 50);
  const buffer = new Uint8Array(mb * 1024 * 1024);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store",
      "Content-Length": String(buffer.byteLength),
    },
  });
}
