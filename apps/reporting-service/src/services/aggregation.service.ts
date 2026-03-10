import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';

export const AggregationService = {
  async updateSiteSummary(siteId: string, crawlJobId: string) {
    const totalIssues = await IssueAnalyticsRepository.countIssues(
      siteId,
      crawlJobId
    );

    const severityBreakdown =
      await IssueAnalyticsRepository.getSeverityBreakdown(siteId, crawlJobId);

    const critical =
      severityBreakdown.find(s => s.severity === 'critical')?.count || 0;

    const serious =
      severityBreakdown.find(s => s.severity === 'serious')?.count || 0;

    const moderate =
      severityBreakdown.find(s => s.severity === 'moderate')?.count || 0;

    const minor =
      severityBreakdown.find(s => s.severity === 'minor')?.count || 0;

    await SiteIssueSummaryRepository.upsert({
      site_id: siteId,
      crawl_job_id: crawlJobId,
      total_issues: totalIssues,
      critical_count: critical,
      serious_count: serious,
      moderate_count: moderate,
      minor_count: minor,
    });
  },
};
