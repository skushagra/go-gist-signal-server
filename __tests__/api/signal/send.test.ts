import { POST } from "@/app/api/signal/send/route";
import { kv } from "@vercel/kv";

// Mock @vercel/kv
jest.mock("@vercel/kv", () => ({
  kv: {
    rpush: jest.fn(),
  },
}));

describe("POST /api/signal/send", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    const testCases = [
      {},
      { session: "test" },
      { session: "test", from: "peer1" },
      { session: "test", from: "peer1", to: "peer2" },
      { session: "test", from: "peer1", to: "peer2", type: "offer" },
    ];

    for (const body of testCases) {
      const request = new Request("http://localhost:3000/api/signal/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("missing fields");
    }
  });

  it("should successfully send a signal message", async () => {
    (kv.rpush as jest.Mock).mockResolvedValue(1);

    const signalData = {
      session: "test-session",
      from: "peer-1",
      to: "peer-2",
      type: "offer",
      data: { sdp: "test-sdp" },
    };

    const request = new Request("http://localhost:3000/api/signal/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signalData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(kv.rpush).toHaveBeenCalledWith(
      "signal:test-session:peer-2",
      expect.stringContaining('"from":"peer-1"')
    );
  });

  it("should include timestamp in the message", async () => {
    (kv.rpush as jest.Mock).mockResolvedValue(1);

    const signalData = {
      session: "test-session",
      from: "peer-1",
      to: "peer-2",
      type: "answer",
      data: { sdp: "test-answer-sdp" },
    };

    const request = new Request("http://localhost:3000/api/signal/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signalData),
    });

    await POST(request);

    const rpushCall = (kv.rpush as jest.Mock).mock.calls[0];
    const savedMessage = JSON.parse(rpushCall[1]);

    expect(savedMessage.ts).toBeDefined();
    expect(typeof savedMessage.ts).toBe("number");
    expect(savedMessage.from).toBe("peer-1");
    expect(savedMessage.type).toBe("answer");
    expect(savedMessage.data).toEqual({ sdp: "test-answer-sdp" });
  });
});
