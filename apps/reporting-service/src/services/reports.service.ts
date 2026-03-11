import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { publishReportGeneration } from '../publishers/report.publisher';
import { v4 as uuidv4 } from 'uuid';

export const ReportsService = {
  async getSiteSummary(siteId: string, crawlJobId?: string) {
    return SiteIssueSummaryRepository.getSiteSummary(siteId, crawlJobId);
  },

  async getSeverityBreakdown(siteId: string, crawlJobId?: string) {
    return IssueAnalyticsRepository.getSeverityBreakdown(siteId, crawlJobId);
  },

  async getTopPages(siteId: string, crawlJobId?: string) {
    return PageIssueSummaryRepository.getTopPages(siteId, crawlJobId);
  },

  async getIssues(siteId: string, severity?: string, page?: number) {
    const limit = 50;
    if (!page) {
      page = 1;
    }
    const offset = (page - 1) * limit;

    return IssueAnalyticsRepository.getIssues(siteId, severity, limit, offset);
  },

  async generateReport(payload: any) {
    const reportId = uuidv4();

    await ReportsRepository.create({
      id: reportId,
      site_id: payload.siteId,
      crawl_job_id: payload.crawlJobId,
      requested_by: payload.userId,
      report_type: payload.reportType,
      status: 'pending',
      filters: payload.filters,
    });

    await publishReportGeneration({
      reportId,
      ...payload,
    });

    return reportId;
  },
};
