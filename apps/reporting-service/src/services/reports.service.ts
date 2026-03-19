import { v4 as uuidv4 } from 'uuid';

import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';

import { publishReportGeneration } from '../publishers/report.publisher';
// add function to normalize date range
function normalizeDateRange(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) {
    return { start: undefined, end: undefined };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  // convert date into timestamp format
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
      // edge case when no crawl jobs found in date range
      return null;
    }

    return job.id;
  }
  // find latest crawl job
  const latest = await CrawlJobRepository.findLatest(siteId);

  if (!latest?.id) {
    // No latest crawl job found
    return null;
  }

  return latest.id;
}

export const ReportsService = {
  // add service to get site summary
  async getSiteSummary(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);
    if (!jobId) {
      // edge case where no crawl job found
      return [];
    }
    return SiteIssueSummaryRepository.getSiteSummary(siteId, jobId, start, end);
  },
  // add service to get severity breakdown
  async getSeverityBreakdown(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);
    if (!jobId) {
      // edge case where no crawl job found
      return [];
    }
    return IssueAnalyticsRepository.getSeverityBreakdown(
      siteId,
      jobId,
      start,
      end
    );
  },
  // add service to get top pages
  async getTopPages(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    const jobId = await resolveCrawlJob(siteId, crawlJobId, start, end);
    if (!jobId) {
      // edge case where no crawl job found
      return [];
    }
    return PageIssueSummaryRepository.getTopPages(siteId, jobId, start, end);
  },
  // add service to get site issues
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
    if (!jobId) {
      // edge case where no crawl job found
      return [];
    }
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
  // add generate report service
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
    if (!jobId) {
      // Invalid request if no crawl job found
      throw new Error('No crawl data available to generate report');
    }
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
