import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { publishReportGeneration } from '../publishers/report.publisher';
import { v4 as uuidv4 } from 'uuid';
import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';

async function resolveCrawlJob(siteId: string, crawlJobId?: string) {
  if (crawlJobId) return crawlJobId;

  const latest = await CrawlJobRepository.findLatest(siteId);

  if (!latest) {
    throw new Error('No crawl jobs found for this site');
  }

  return latest.id;
}

export const ReportsService = {
  async getSiteSummary(siteId: string, crawlJobId?: string) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId);
    return SiteIssueSummaryRepository.getSiteSummary(siteId, jobId);
  },

  async getSeverityBreakdown(siteId: string, crawlJobId?: string) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId);
    return IssueAnalyticsRepository.getSeverityBreakdown(siteId, jobId);
  },

  async getTopPages(siteId: string, crawlJobId?: string) {
    const jobId = await resolveCrawlJob(siteId, crawlJobId);
    return PageIssueSummaryRepository.getTopPages(siteId, jobId);
  },

  async getIssues(siteId: string, severity?: string, page = 1) {
    const limit = 50;
    const offset = (page - 1) * limit;

    return IssueAnalyticsRepository.getIssues(siteId, severity, limit, offset);
  },

  async generateReport(payload: any) {
    const jobId = await resolveCrawlJob(payload.siteId, payload.crawlJobId);

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
      reportId,
      crawlJobId: jobId,
      ...payload,
    });

    return reportId;
  },
};
