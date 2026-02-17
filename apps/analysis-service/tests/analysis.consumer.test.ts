import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("amqplib", async () => {
  const mockAck = vi.fn();
  const mockNack = vi.fn();
  const mockConsume = vi.fn();
  const mockAssertQueue = vi.fn();

  const mockChannel = {
    assertQueue: mockAssertQueue,
    consume: mockConsume,
    ack: mockAck,
    nack: mockNack,
  };

  const mockConnection = {
    createChannel: vi.fn().mockResolvedValue(mockChannel),
  };

  return {
    default: {
      connect: vi.fn().mockResolvedValue(mockConnection),
    },
    __mock: {
      mockAck,
      mockNack,
      mockConsume,
      mockAssertQueue,
      mockChannel,
      mockConnection,
    },
  };
});

vi.mock("../src/services/analysis.service", () => ({
  AnalysisService: {
    process: vi.fn(),
  },
}));

import amqp from "amqplib";
import { startAnalysisConsumer } from "../src/consumers/analysis.consumer";
import { AnalysisService } from "../src/services/analysis.service";

const mocks = (amqp as any).__mock;

describe("Analysis Consumer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should connect and start consuming", async () => {
    await startAnalysisConsumer();

    expect(mocks.mockConnection.createChannel).toHaveBeenCalled();
    expect(mocks.mockAssertQueue).toHaveBeenCalledWith(
      "analysis_jobs",
      { durable: true }
    );
    expect(mocks.mockConsume).toHaveBeenCalled();
  });

  it("should ack on success", async () => {
    await startAnalysisConsumer();

    const consumeCallback = mocks.mockConsume.mock.calls[0][1];

    const fakeMsg = {
      content: Buffer.from(JSON.stringify({ pageVersionId: "123" })),
    };

    (AnalysisService.process as any).mockResolvedValue(undefined);

    await consumeCallback(fakeMsg);

    expect(AnalysisService.process).toHaveBeenCalledWith({
      pageVersionId: "123",
    });

    expect(mocks.mockAck).toHaveBeenCalledWith(fakeMsg);
  });

  it("should nack on failure", async () => {
    await startAnalysisConsumer();

    const consumeCallback = mocks.mockConsume.mock.calls[0][1];

    const fakeMsg = {
      content: Buffer.from(JSON.stringify({ pageVersionId: "123" })),
    };

    (AnalysisService.process as any).mockRejectedValue(
      new Error("Failure")
    );

    await consumeCallback(fakeMsg);

    expect(mocks.mockNack).toHaveBeenCalledWith(fakeMsg);
  });
});