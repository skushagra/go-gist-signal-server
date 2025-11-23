// app/api/session/create/route.ts

import { kv } from '@vercel/kv'

export async function POST(req: Request) {
    const body = await req.json()
    const { session } = body

    if (!session) {
        return Response.json({ error: "session required" }, { status: 400 })
    }

    // Create peerID for A
    const peerID = crypto.randomUUID()

    // Store A as first peer in session
    await kv.hset(`session:${session}`, {
        peers: JSON.stringify([peerID]),
    })

    return Response.json({ peerID })
}
