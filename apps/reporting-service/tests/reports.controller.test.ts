import { describe, it, expect, vi, beforeEach } from "vitest"
import { ReportsController } from "../src/controllers/reports.controller"
import { ReportsService } from "../src/services/reports.service"
import { handleError } from "@packages/shared-utils/error-handler"

vi.mock("../src/services/reports.service", () => ({
  ReportsService: {
    getSiteSummary: vi.fn(),
    getSeverityBreakdown: vi.fn(),
    getTopPages: vi.fn(),
    getIssues: vi.fn(),
    generateReport: vi.fn(),
  },
}))

vi.mock("@packages/shared-utils/error-handler", () => ({
  handleError: vi.fn(),
}))

const SITE_ID = "550e8400-e29b-41d4-a716-446655440000"

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
}

describe("ReportsController", () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("siteSummary should return summary", async () => {

    const req: any = {
      query: { siteId: SITE_ID }
    }

    const res = mockRes()

    vi.mocked(ReportsService.getSiteSummary)
      .mockResolvedValue({ pages_crawled: 10 } as any)

    await ReportsController.siteSummary(req, res as any)

    expect(ReportsService.getSiteSummary).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ pages_crawled: 10 })

  })

  it("issuesBreakdown should return severity breakdown", async () => {

    const req: any = { query: { siteId: SITE_ID } }
    const res = mockRes()

    vi.mocked(ReportsService.getSeverityBreakdown)
      .mockResolvedValue([])

    await ReportsController.issuesBreakdown(req, res as any)

    expect(ReportsService.getSeverityBreakdown).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)

  })

  it("topPages should return pages", async () => {

    const req: any = { query: { siteId: SITE_ID } }
    const res = mockRes()

    vi.mocked(ReportsService.getTopPages)
      .mockResolvedValue([])

    await ReportsController.topPages(req, res as any)

    expect(ReportsService.getTopPages).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)

  })

  it("issuesTable should return issues", async () => {

    const req: any = {
      query: { siteId: SITE_ID, page: 1 }
    }

    const res = mockRes()

    vi.mocked(ReportsService.getIssues)
      .mockResolvedValue({ rows: [], count: 0 })

    await ReportsController.issuesTable(req, res as any)

    expect(ReportsService.getIssues).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)

  })

  it("exportReport should return unauthorized if user missing", async () => {

    const req: any = {
      body: {
        siteId: SITE_ID,
        reportType: "pdf"
      },
      userId: undefined
    }

    const res = mockRes()

    await ReportsController.exportReport(req, res as any)

    expect(res.status).toHaveBeenCalledWith(401)

  })

  it("exportReport should generate report", async () => {

    const req: any = {
      body: {
        siteId: SITE_ID,
        reportType: "pdf"
      },
      userId: "user-1"
    }

    const res = mockRes()

    vi.mocked(ReportsService.generateReport)
      .mockResolvedValue("report-123")

    await ReportsController.exportReport(req, res as any)

    expect(ReportsService.generateReport).toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(202)

  })

  it("should handle errors", async () => {

    const req: any = { query: {} }
    const res = mockRes()

    await ReportsController.siteSummary(req, res as any)

    expect(handleError).toHaveBeenCalled()

  })

})