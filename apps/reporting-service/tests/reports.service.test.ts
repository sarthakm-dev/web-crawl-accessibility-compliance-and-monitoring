import { describe, it, expect, vi, beforeEach } from "vitest"

import { ReportsService } from "../src/services/reports.service"
import { CrawlJobRepository } from "../src/repositories/crawl-job.repository"
import { IssueAnalyticsRepository } from "../src/repositories/issue-analytics.repository"
import { PageIssueSummaryRepository } from "../src/repositories/page-issue-summary.repository"
import { SiteIssueSummaryRepository } from "../src/repositories/site-issue-summary.repository"
import { ReportsRepository } from "../src/repositories/reports.repository"
import { publishReportGeneration } from "../src/publishers/report.publisher"

vi.mock("../src/repositories/crawl-job.repository", () => ({
  CrawlJobRepository: {
    findLatest: vi.fn(),
    findByDate: vi.fn(),
  },
}))

vi.mock("../src/repositories/issue-analytics.repository", () => ({
  IssueAnalyticsRepository: {
    getSeverityBreakdown: vi.fn(),
    getIssues: vi.fn(),
  },
}))

vi.mock("../src/repositories/page-issue-summary.repository", () => ({
  PageIssueSummaryRepository: {
    getTopPages: vi.fn(),
  },
}))

vi.mock("../src/repositories/site-issue-summary.repository", () => ({
  SiteIssueSummaryRepository: {
    getSiteSummary: vi.fn(),
  },
}))

vi.mock("../src/repositories/reports.repository", () => ({
  ReportsRepository: {
    create: vi.fn(),
  },
}))

vi.mock("../src/publishers/report.publisher", () => ({
  publishReportGeneration: vi.fn(),
}))

vi.mock("uuid", () => ({
  v4: () => "mock-report-id",
}))

const SITE_ID = "site-1"
const JOB_ID = "job-1"

describe("ReportsService", () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return site summary with provided crawlJobId", async () => {

    vi.mocked(SiteIssueSummaryRepository.getSiteSummary)
      .mockResolvedValue({ pages_crawled: 10 } as any)

    const result = await ReportsService.getSiteSummary(SITE_ID, JOB_ID)

    expect(SiteIssueSummaryRepository.getSiteSummary)
      .toHaveBeenCalledWith(SITE_ID, JOB_ID, undefined, undefined)

    expect(result).toEqual({ pages_crawled: 10 })

  })

  it("should resolve crawl job by date", async () => {

    vi.mocked(CrawlJobRepository.findByDate)
      .mockResolvedValue({ id: JOB_ID } as any)

    vi.mocked(IssueAnalyticsRepository.getSeverityBreakdown)
      .mockResolvedValue([])

    const result = await ReportsService.getSeverityBreakdown(
      SITE_ID,
      undefined,
      new Date(),
      new Date()
    )

    expect(CrawlJobRepository.findByDate).toHaveBeenCalled()

    expect(IssueAnalyticsRepository.getSeverityBreakdown)
      .toHaveBeenCalledWith(SITE_ID, JOB_ID, expect.any(Date), expect.any(Date))

    expect(result).toEqual([])

  })

  it("should fallback to latest crawl job", async () => {

    vi.mocked(CrawlJobRepository.findLatest)
      .mockResolvedValue({ id: JOB_ID } as any)

    vi.mocked(PageIssueSummaryRepository.getTopPages)
      .mockResolvedValue([])

    const result = await ReportsService.getTopPages(SITE_ID)

    expect(CrawlJobRepository.findLatest).toHaveBeenCalled()

    expect(PageIssueSummaryRepository.getTopPages)
      .toHaveBeenCalledWith(SITE_ID, JOB_ID, undefined, undefined)

    expect(result).toEqual([])

  })

  it("should throw error if no crawl job found", async () => {

    vi.mocked(CrawlJobRepository.findLatest)
      .mockResolvedValue(null)

    await expect(
      ReportsService.getSiteSummary(SITE_ID)
    ).rejects.toThrow()

  })

  it("should return issues with pagination", async () => {

    vi.mocked(CrawlJobRepository.findLatest)
      .mockResolvedValue({ id: JOB_ID } as any)

    vi.mocked(IssueAnalyticsRepository.getIssues)
      .mockResolvedValue({ rows: [], count: 0 } as any)

    const result = await ReportsService.getIssues(
      SITE_ID,
      "critical",
      10,
      2
    )

    expect(IssueAnalyticsRepository.getIssues)
      .toHaveBeenCalledWith(SITE_ID, "critical", 10, 10, JOB_ID, undefined, undefined)

    expect(result).toEqual({ rows: [], count: 0 })

  })

  it("should generate report", async () => {

    vi.mocked(CrawlJobRepository.findLatest)
      .mockResolvedValue({ id: JOB_ID } as any)

    const payload = {
      siteId: SITE_ID,
      reportType: "pdf",
      userId: "user-1",
      filters: {},
    }

    const result = await ReportsService.generateReport(payload)

    expect(ReportsRepository.create).toHaveBeenCalled()

    expect(publishReportGeneration).toHaveBeenCalled()

    expect(result).toBe("mock-report-id")

  })

})