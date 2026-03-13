import { describe, it, expect } from "vitest";
import { generatePdfStream } from "../src/services/pdf.service";
import { Readable } from "stream";

function readStream(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

describe("generatePdfStream", () => {

  it("should generate PDF with issues", async () => {

    const payload = {
      site: { name: "Test Site", base_url: "https://example.com" },
      summary: {
        accessibility_score: 90,
        pages_crawled: 10,
        total_issues: 5,
        critical_count: 1,
        serious_count: 2,
        moderate_count: 1,
        minor_count: 1
      },
      issues: [
        {
          rule_id: "img-alt",
          page_url: "https://example.com",
          severity: "critical",
          rule_description: "Image missing alt",
          message: "Add alt attribute\nfor accessibility"
        }
      ]
    };

    const stream = generatePdfStream(payload);

    const buffer = await readStream(stream);

    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should generate PDF when no issues exist", async () => {

    const payload = {
      site: { name: "Test Site", base_url: "https://example.com" },
      summary: {},
      issues: []
    };

    const stream = generatePdfStream(payload);

    const buffer = await readStream(stream);

    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should handle non-array issues safely", async () => {

    const payload = {
      site: { name: "Test", base_url: "https://example.com" },
      summary: {},
      issues: null
    };

    const stream = generatePdfStream(payload);

    const buffer = await readStream(stream);

    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should support sequelize dataValues format", async () => {

    const payload = {
      site: {},
      summary: {},
      issues: [
        {
          dataValues: {
            rule_id: "color-contrast",
            page_url: "https://example.com",
            severity: "serious",
            rule_description: "Low contrast",
            message: "Increase contrast"
          }
        }
      ]
    };

    const stream = generatePdfStream(payload);

    const buffer = await readStream(stream);

    expect(buffer.length).toBeGreaterThan(0);
  });

  it("should handle missing optional fields", async () => {

    const payload = {
      site: {},
      summary: {},
      issues: [
        {
          rule_id: "heading-order"
        }
      ]
    };

    const stream = generatePdfStream(payload);

    const buffer = await readStream(stream);

    expect(buffer.length).toBeGreaterThan(0);
  });

});