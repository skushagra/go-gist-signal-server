// app/api/signal/send/route.ts

import { kv } from '@vercel/kv'

export async function POST(req: Request) {
    const body = await req.json()
    const { session, from, to, type, data } = body

    if (!session || !from || !to || !type || !data) {
        return Response.json({ error: "missing fields" }, { status: 400 })
    }

    const key = `signal:${session}:${to}`

    // Append message to receiver's queue
    await kv.rpush(key, JSON.stringify({
        from,
        type,
        data,
        ts: Date.now()
    }))

    return Response.json({ status: "ok" })
}
