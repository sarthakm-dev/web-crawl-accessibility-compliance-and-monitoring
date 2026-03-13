import { v4 as uuidv4 } from "uuid";
import { CrawlJobRepository } from "../repositories/crawl-job.repository";
import { IssueAnalyticsRepository } from "../repositories/issue-analytics.repository";
import { PageIssueSummaryRepository } from "../repositories/page-issue-summary.repository";
import { ReportsRepository } from "../repositories/reports.repository";
import { SiteIssueSummaryRepository } from "../repositories/site-issue-summary.repository";

import { publishReportGeneration } from "../publishers/report.publisher";

async function resolveCrawlJob(
  siteId: string,
  crawlJobId?: string,
  startDate?: Date,
  endDate?: Date
) {
  if (crawlJobId) return crawlJobId;

  // Resolve crawl job by date
  if (startDate && endDate) {
    

    const job = await CrawlJobRepository.findByDate(siteId, startDate, endDate);

    if (!job?.id) {
      throw new Error(`No crawl job found for site ${siteId} in date range`);
    }

    return job.id;
  }

  // fallback to latest
  const latest = await CrawlJobRepository.findLatest(siteId);

  if (!latest?.id) {
    throw new Error(`No crawl jobs found for site ${siteId}`);
  }

  return latest.id;
}

export const ReportsService = {

  async getSiteSummary(siteId: string, crawlJobId?: string, startDate?: Date,endDate?:Date) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId, startDate,endDate);

    return SiteIssueSummaryRepository.getSiteSummary(siteId, jobId,startDate,endDate);
  },

  async getSeverityBreakdown(siteId: string, crawlJobId?: string, startDate?: Date,endDate?:Date) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId, startDate,endDate);

    return IssueAnalyticsRepository.getSeverityBreakdown(siteId, jobId,startDate,endDate);
  },

  async getTopPages(siteId: string, crawlJobId?: string, startDate?: Date,endDate?:Date) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId, startDate,endDate);

    return PageIssueSummaryRepository.getTopPages(siteId, jobId,startDate,endDate);
  },

  async getIssues(
    siteId: string,
    severity?: string,
    limit = 10,
    page = 1,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId, startDate,endDate);

    const offset = (page - 1) * limit;

    return IssueAnalyticsRepository.getIssues(
      siteId,
      severity,
      limit,
      offset,
      jobId,
      startDate,
      endDate
    );
  },

  async generateReport(payload: any) {
    const jobId = await resolveCrawlJob(
      payload.siteId,
      payload.crawlJobId,
      payload.filters?.startDate,
      payload.filters?.endDate
    );

    const reportId = uuidv4();

    await ReportsRepository.create({
      id: reportId,
      site_id: payload.siteId,
      crawl_job_id: jobId,
      requested_by: payload.userId,
      report_type: payload.reportType,
      status: "pending",
      filters: payload.filters,
    });

    await publishReportGeneration({
      ...payload,
      reportId,
      crawlJobId: jobId,
    });

    return reportId;
  }

};