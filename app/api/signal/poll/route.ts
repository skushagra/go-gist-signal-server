// app/api/signal/poll/route.ts

import { kv } from "@vercel/kv";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = searchParams.get("session");
  const peerID = searchParams.get("peerID");

  if (!session || !peerID) {
    return Response.json({ error: "session and peerID required" }, { status: 400 });
  }

  const key = `signal:${session}:${peerID}`;

  // Retrieve up to N messages
  const messages = await kv.lrange(key, 0, -1);

  // Clear the queue
  await kv.del(key);

  return Response.json({ messages });
}
