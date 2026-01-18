import { GET } from "@/app/api/signal/poll/route";
import { kv } from "@vercel/kv";

// Mock @vercel/kv
jest.mock("@vercel/kv", () => ({
  kv: {
    lrange: jest.fn(),
    del: jest.fn(),
  },
}));

describe("GET /api/signal/poll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if session is not provided", async () => {
    const request = new Request("http://localhost:3000/api/signal/poll?peerID=peer-1");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("session and peerID required");
  });

  it("should return 400 if peerID is not provided", async () => {
    const request = new Request("http://localhost:3000/api/signal/poll?session=test-session");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("session and peerID required");
  });

  it("should return empty messages array when no messages exist", async () => {
    (kv.lrange as jest.Mock).mockResolvedValue([]);
    (kv.del as jest.Mock).mockResolvedValue(1);

    const request = new Request(
      "http://localhost:3000/api/signal/poll?session=test-session&peerID=peer-1"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.messages).toEqual([]);
    expect(kv.lrange).toHaveBeenCalledWith("signal:test-session:peer-1", 0, -1);
    expect(kv.del).toHaveBeenCalledWith("signal:test-session:peer-1");
  });

  it("should return and clear pending messages", async () => {
    const mockMessages = [
      JSON.stringify({ from: "peer-2", type: "offer", data: { sdp: "test" }, ts: 123 }),
      JSON.stringify({ from: "peer-3", type: "ice", data: { candidate: "test" }, ts: 124 }),
    ];
    (kv.lrange as jest.Mock).mockResolvedValue(mockMessages);
    (kv.del as jest.Mock).mockResolvedValue(1);

    const request = new Request(
      "http://localhost:3000/api/signal/poll?session=test-session&peerID=peer-1"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.messages).toEqual(mockMessages);
    expect(kv.del).toHaveBeenCalledWith("signal:test-session:peer-1");
  });
});
