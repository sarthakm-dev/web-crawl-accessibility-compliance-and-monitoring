import { describe, it, expect, vi, beforeEach } from "vitest";
import { Readable } from "stream";

vi.mock("../src/services/pdf.service", () => ({
  generatePdfStream: vi.fn(),
}));

vi.mock("@packages/shared-config/minio", () => ({
  minioClient: {
    bucketExists: vi.fn(),
    makeBucket: vi.fn(),
    putObject: vi.fn(),
  },
}));

import { uploadReportToMinio } from "../src/services/minio.service";
import { generatePdfStream } from "../src/services/pdf.service";
import { minioClient } from "@packages/shared-config/minio";

function createStream(data: Buffer) {
  const stream = new Readable({
    read() {
      this.push(data);
      this.push(null);
    },
  });
  return stream;
}

describe("uploadReportToMinio", () => {

  const payload = {
    siteId: "site1",
    reportId: "report1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if metadata missing", async () => {

    await expect(uploadReportToMinio({})).rejects.toThrow(
      "Missing metadata"
    );

  });

  it("should create bucket if not exists and upload pdf", async () => {

    vi.mocked(minioClient.bucketExists).mockResolvedValue(false);
    vi.mocked(minioClient.makeBucket).mockResolvedValue(undefined);
    vi.mocked(minioClient.putObject).mockResolvedValue({etag: "mock-etag",versionId:"1"}as any);

    vi.mocked(generatePdfStream).mockReturnValue(
      createStream(Buffer.from("pdf-data")) as any
    );

    const result = await uploadReportToMinio(payload);

    expect(minioClient.makeBucket).toHaveBeenCalled();
    expect(minioClient.putObject).toHaveBeenCalled();

    expect(result.fileName).toBe("report-report1.pdf");
    expect(result.buffer.length).toBeGreaterThan(0);

  });

  it("should upload pdf if bucket already exists", async () => {

    vi.mocked(minioClient.bucketExists).mockResolvedValue(true);
    vi.mocked(minioClient.putObject).mockResolvedValue({etag: "mock-etag",versionId:"1"}as any);

    vi.mocked(generatePdfStream).mockReturnValue(
      createStream(Buffer.from("pdf")) as any
    );

    await uploadReportToMinio(payload);

    expect(minioClient.makeBucket).not.toHaveBeenCalled();
    expect(minioClient.putObject).toHaveBeenCalled();

  });

  it("should reject if pdf stream errors", async () => {

    vi.mocked(minioClient.bucketExists).mockResolvedValue(true);

    const errorStream = new Readable({
      read() {
        this.destroy(new Error("stream failed"));
      },
    });

    vi.mocked(generatePdfStream).mockReturnValue(errorStream as any);

    await expect(uploadReportToMinio(payload)).rejects.toThrow(
      "stream failed"
    );

  });

});