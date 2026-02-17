import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxeAnalyzer } from "../src/analyzers/axe.analyzer";
import { getBrowser } from "../src/browser/browser";

vi.mock("../src/browser/browser", () => ({
  getBrowser: vi.fn(),
}));

describe("AxeAnalyzer", () => {
  const mockPage = {
    setContent: vi.fn(),
    addScriptTag: vi.fn(),
    evaluate: vi.fn(),
    close: vi.fn(),
  };

  const mockBrowser = {
    newPage: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (getBrowser as any).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
  });


  it("should analyze HTML and return axe results", async () => {
    const fakeResults = {
      violations: [
        {
          id: "color-contrast",
          impact: "moderate",
        },
      ],
    };

    mockPage.evaluate.mockResolvedValue(fakeResults);

    const result = await AxeAnalyzer.analyze("<html></html>");

    expect(getBrowser).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setContent).toHaveBeenCalledWith("<html></html>", {
      waitUntil: "load",
    });
    expect(mockPage.addScriptTag).toHaveBeenCalled();
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(mockPage.close).toHaveBeenCalled();

    expect(result).toEqual(fakeResults);
  });


  it("should close page even if evaluate throws", async () => {
    mockPage.evaluate.mockRejectedValue(new Error("Axe crashed"));

    await expect(
      AxeAnalyzer.analyze("<html></html>")
    ).rejects.toThrow("Axe crashed");

    expect(mockPage.close).toHaveBeenCalled();
  });


  it("should close page if setContent fails", async () => {
    mockPage.setContent.mockRejectedValue(new Error("Invalid HTML"));

    await expect(
      AxeAnalyzer.analyze("<html></html>")
    ).rejects.toThrow("Invalid HTML");

    expect(mockPage.close).toHaveBeenCalled();
  });
});