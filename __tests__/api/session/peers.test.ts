import { GET } from "@/app/api/session/peers/route";
import { kv } from "@vercel/kv";

// Mock @vercel/kv
jest.mock("@vercel/kv", () => ({
  kv: {
    hget: jest.fn(),
  },
}));

describe("GET /api/session/peers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if session is not provided", async () => {
    const request = new Request("http://localhost:3000/api/session/peers");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("session required");
  });

  it("should return empty array if session has no peers", async () => {
    (kv.hget as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/session/peers?session=test-session");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.peers).toEqual([]);
  });

  it("should return peers for existing session", async () => {
    const mockPeers = ["peer-1", "peer-2", "peer-3"];
    (kv.hget as jest.Mock).mockResolvedValue(JSON.stringify(mockPeers));

    const request = new Request("http://localhost:3000/api/session/peers?session=test-session");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.peers).toEqual(mockPeers);
    expect(kv.hget).toHaveBeenCalledWith("session:test-session", "peers");
  });

  it("should handle malformed JSON in peers data", async () => {
    (kv.hget as jest.Mock).mockResolvedValue("invalid-json");

    const request = new Request("http://localhost:3000/api/session/peers?session=test-session");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.peers).toEqual([]);
  });
});
