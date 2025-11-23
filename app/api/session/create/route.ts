import { kv } from "@vercel/kv";

export async function POST(req: Request) {
    const body = await req.json();
    const { session } = body;

    if (!session) {
        return Response.json({ error: "session required" }, { status: 400 });
    }

    // generate unique peer ID
    const peerID = crypto.randomUUID();

    const key = `session:${session}`;
    const data = await kv.hget(key, "peers");

    let peers = [];

    if (data) {
        try {
            peers = JSON.parse(data as string);
        } catch {
            peers = [];
        }
    }

    // append peerID
    peers.push(peerID);

    // save back
    await kv.hset(key, {
        peers: JSON.stringify(peers),
    });

    return Response.json({ peerID });
}
