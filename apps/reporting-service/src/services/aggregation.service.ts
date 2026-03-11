import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';
import {v4 as uuidv4} from 'uuid';

export const AggregationService = {

  async aggregate(siteId: string, crawlJobId: string) {

    await this.updateSiteSummary(siteId, crawlJobId);

    await this.updatePageSummary(siteId, crawlJobId);

  },

  async updateSiteSummary(siteId: string, crawlJobId: string) {
    const totalIssues = await IssueAnalyticsRepository.countIssues(
      siteId,
      crawlJobId
    );

    const severityBreakdown =
      await IssueAnalyticsRepository.getSeverityBreakdown(siteId, crawlJobId);

    const critical =
      Number(severityBreakdown.find(s => s.severity === 'critical')?.count || 0);

    const serious =
      Number(severityBreakdown.find(s => s.severity === 'serious')?.count || 0);

    const moderate =
      Number(severityBreakdown.find(s => s.severity === 'moderate')?.count || 0);

    const minor =
      Number(severityBreakdown.find(s => s.severity === 'minor')?.count || 0);

    await SiteIssueSummaryRepository.upsert({
      id: uuidv4(),
      site_id: siteId,
      crawl_job_id: crawlJobId,
      total_issues: totalIssues,
      critical_count: critical,
      serious_count: serious,
      moderate_count: moderate,
      minor_count: minor,
    });
  },
  async updatePageSummary(siteId: string, crawlJobId: string) {

  const pageBreakdown =
    await IssueAnalyticsRepository.getPageBreakdown(siteId, crawlJobId);

  const records = pageBreakdown.map(page => ({
    id: uuidv4(),
    site_id: siteId,
    crawl_job_id: crawlJobId,
    page_id: page.page_id,
    page_url: page.page_url,

    total_issues: page.total_issues,
    critical_count: page.critical_count,
    serious_count: page.serious_count,
    moderate_count: page.moderate_count,
    minor_count: page.minor_count
  }));

  await PageIssueSummaryRepository.bulkUpsert(records);

}
};