import { POST } from "@/app/api/session/create/route";
import { kv } from "@vercel/kv";

// Mock @vercel/kv
jest.mock("@vercel/kv", () => ({
  kv: {
    hget: jest.fn(),
    hset: jest.fn(),
  },
}));

describe("POST /api/session/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if session is not provided", async () => {
    const request = new Request("http://localhost:3000/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("session required");
  });

  it("should create a new peer and return peerID", async () => {
    (kv.hget as jest.Mock).mockResolvedValue(null);
    (kv.hset as jest.Mock).mockResolvedValue("OK");

    const request = new Request("http://localhost:3000/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: "test-session" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.peerID).toBeDefined();
    expect(typeof data.peerID).toBe("string");
    expect(kv.hset).toHaveBeenCalledWith(
      "session:test-session",
      expect.objectContaining({
        peers: expect.any(String),
      })
    );
  });

  it("should append peer to existing session", async () => {
    const existingPeers = JSON.stringify(["existing-peer-1"]);
    (kv.hget as jest.Mock).mockResolvedValue(existingPeers);
    (kv.hset as jest.Mock).mockResolvedValue("OK");

    const request = new Request("http://localhost:3000/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: "test-session" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.peerID).toBeDefined();

    // Verify that hset was called with both existing and new peer
    const hsetCall = (kv.hset as jest.Mock).mock.calls[0];
    const savedPeers = JSON.parse(hsetCall[1].peers);
    expect(savedPeers).toContain("existing-peer-1");
    expect(savedPeers.length).toBe(2);
  });
});
