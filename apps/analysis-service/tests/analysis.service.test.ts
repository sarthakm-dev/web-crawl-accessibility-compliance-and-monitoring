import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxeAnalyzer } from "../src/analyzers/axe.analyzer";
import { IssueInstance } from "../src/models/issue-instance.model";
import { IssueDefinition } from "../src/models/issue-definition.model";
import { IssueStatusHistory } from "../src/models/issue-status-history.model";
import { PageVersion } from "../src/models/page-version.model";
import { sequelize } from "../../../packages/shared-config/database";

vi.mock("../src/analyzers/axe.analyzer");
vi.mock("../src/models/issue-instance.model");
vi.mock("../src/models/issue-definition.model");
vi.mock("../src/models/issue-status-history.model");
vi.mock("../src/models/page-version.model");
vi.mock("../../../packages/shared-config/database");

import { AnalysisService } from "../src/services/analysis.service";

describe("AnalysisService", () => {
  const fakeTransaction = {
    commit: vi.fn(),
    rollback: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (sequelize.transaction as any).mockResolvedValue(fakeTransaction);
  });


  it("should skip if issues already exist", async () => {
    (IssueInstance.count as any).mockResolvedValue(5);

    await AnalysisService.process({ pageVersionId: "123" });

    expect(IssueInstance.count).toHaveBeenCalledWith({
      where: { page_version_id: "123" },
    });

    expect(PageVersion.findByPk).not.toHaveBeenCalled();
  });

 

  it("should throw if pageVersion not found", async () => {
    (IssueInstance.count as any).mockResolvedValue(0);
    (PageVersion.findByPk as any).mockResolvedValue(null);

    await expect(
      AnalysisService.process({ pageVersionId: "123" })
    ).rejects.toThrow("Page version or HTML not found");
  });



  it("should throw if html_content is missing", async () => {
    (IssueInstance.count as any).mockResolvedValue(0);
    (PageVersion.findByPk as any).mockResolvedValue({
      id: "123",
      html_content: null,
    });

    await expect(
      AnalysisService.process({ pageVersionId: "123" })
    ).rejects.toThrow("Page version or HTML not found");
  });



  it("should analyze page and create issues", async () => {
    (IssueInstance.count as any).mockResolvedValue(0);

    (PageVersion.findByPk as any).mockResolvedValue({
      id: "123",
      html_content: "<html></html>",
    });

    (AxeAnalyzer.analyze as any).mockResolvedValue({
      violations: [
        {
          id: "color-contrast",
          help: "Color contrast issue",
          description: "Some description",
          impact: "moderate",
          tags: ["wcag2a"],
          nodes: [
            {
              target: ["#header"],
              failureSummary: "Fix contrast",
            },
          ],
        },
      ],
    });

    (IssueDefinition.findOrCreate as any).mockResolvedValue([
      { id: "def1" },
    ]);

    (IssueInstance.create as any).mockResolvedValue({
      id: "inst1",
    });

    await AnalysisService.process({ pageVersionId: "123" });

    expect(AxeAnalyzer.analyze).toHaveBeenCalledWith("<html></html>");
    expect(IssueDefinition.findOrCreate).toHaveBeenCalled();
    expect(IssueInstance.create).toHaveBeenCalled();
    expect(IssueStatusHistory.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should rollback transaction if error occurs", async () => {
    (IssueInstance.count as any).mockResolvedValue(0);

    (PageVersion.findByPk as any).mockResolvedValue({
      id: "123",
      html_content: "<html></html>",
    });

    (AxeAnalyzer.analyze as any).mockResolvedValue({
      violations: [
        {
          id: "color-contrast",
          help: "Color contrast issue",
          description: "Some description",
          impact: "moderate",
          tags: ["wcag2a"],
          nodes: [
            {
              target: ["#header"],
              failureSummary: "Fix contrast",
            },
          ],
        },
      ],
    });

    (IssueDefinition.findOrCreate as any).mockResolvedValue([
      { id: "def1" },
    ]);

    // Force failure
    (IssueInstance.create as any).mockRejectedValue(
      new Error("DB error")
    );

    await expect(
      AnalysisService.process({ pageVersionId: "123" })
    ).rejects.toThrow("DB error");

    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});