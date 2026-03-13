import { v4 as uuidv4 } from 'uuid';

import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';

import { publishReportGeneration } from '../publishers/report.publisher';

function normalizeDateRange(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) {
    return { start: undefined, end: undefined };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

async function resolveCrawlJob(
  siteId: string,
  crawlJobId?: string,
  startDate?: Date,
  endDate?: Date
) {
  if (crawlJobId) return crawlJobId;

  if (startDate && endDate) {
    const job = await CrawlJobRepository.findByDate(siteId, startDate, endDate);

    if (!job?.id) {
      throw new Error(`No crawl job found for site ${siteId} in date range`);
    }

    return job.id;
  }

  const latest = await CrawlJobRepository.findLatest(siteId);

  if (!latest?.id) {
    throw new Error(`No crawl jobs found for site ${siteId}`);
  }

  return latest.id;
}

export const ReportsService = {
  async getSiteSummary(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);

    return SiteIssueSummaryRepository.getSiteSummary(siteId, jobId, start, end);
  },

  async getSeverityBreakdown(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);

    return IssueAnalyticsRepository.getSeverityBreakdown(
      siteId,
      jobId,
      start,
      end
    );
  },

  async getTopPages(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);

    return PageIssueSummaryRepository.getTopPages(siteId, jobId, start, end);
  },

  async getIssues(
    siteId: string,
    severity?: string,
    limit = 10,
    page = 1,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);

    const offset = (page - 1) * limit;

    return IssueAnalyticsRepository.getIssues(
      siteId,
      severity,
      limit,
      offset,
      jobId,
      start,
      end
    );
  },

  async generateReport(payload: any) {
    const { start, end } = normalizeDateRange(
      payload.filters?.startDate,
      payload.filters?.endDate
    );

    const jobId = await resolveCrawlJob(
      payload.siteId,
      payload.crawlJobId,
      start,
      end
    );

    const reportId = uuidv4();

    await ReportsRepository.create({
      id: reportId,
      site_id: payload.siteId,
      crawl_job_id: jobId,
      requested_by: payload.userId,
      report_type: payload.reportType,
      status: 'pending',
      filters: payload.filters,
    });

    await publishReportGeneration({
      ...payload,
      reportId,
      crawlJobId: jobId,
    });

    return reportId;
  },
};
