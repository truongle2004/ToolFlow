export async function POST(req: Request) {
  await req.arrayBuffer(); // consume body
  return new Response(null, { status: 200 });
}
