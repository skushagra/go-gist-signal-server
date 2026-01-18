import { kv } from "@vercel/kv";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session");

    if (!session) {
        return Response.json({ error: "session required" }, { status: 400 });
    }

    const data = await kv.hget(`session:${session}`, "peers");
    if (!data) {
        return Response.json({ peers: [] });
    }

    let peers: string[];
    try {
        peers = JSON.parse(data as string);
    } catch {
        peers = [];
    }

    return Response.json({ peers });
}
