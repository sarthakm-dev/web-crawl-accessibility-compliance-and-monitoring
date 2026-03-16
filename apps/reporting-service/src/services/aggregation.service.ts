import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../repositories/page-issue-summary.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';
import { v4 as uuidv4 } from 'uuid';

export const AggregationService = {
  async aggregate(siteId: string, crawlJobId: string) {
    await Promise.all([
      this.updateSiteSummary(siteId, crawlJobId),
      this.updatePageSummary(siteId, crawlJobId),
    ]);
  },
  // update site issue summary table
  async updateSiteSummary(siteId: string, crawlJobId: string) {
    const severityBreakdown =
      await IssueAnalyticsRepository.getSeverityBreakdown(siteId, crawlJobId);

    const pagesCrawled = await IssueAnalyticsRepository.countPages(
      siteId,
      crawlJobId
    );

    const map = Object.fromEntries(
      severityBreakdown.map(s => [s.severity, Number(s.count)])
    ) as Record<string, number>;
    // calculate accessibility score for latest crawl job in specified date range
    const totalIssues =
      (map.critical || 0) +
      (map.serious || 0) +
      (map.moderate || 0) +
      (map.minor || 0);
    // Add weights for issues
    const weightedIssues =
      (map.critical || 0) * 10 +
      (map.serious || 0) * 6 +
      (map.moderate || 0) * 3 +
      (map.minor || 0);
    // normalize weights
    const norm = Math.max(pagesCrawled, 10);
    // calculate issue density
    const issueDensity = weightedIssues / norm;
    // Find accessibility score
    const accessibilityScore = Math.max(0, Math.round(100 - issueDensity * 3));

    await SiteIssueSummaryRepository.upsert({
      id: uuidv4(),
      site_id: siteId,
      crawl_job_id: crawlJobId,
      pages_crawled: pagesCrawled,
      total_issues: totalIssues,
      critical_count: map.critical || 0,
      serious_count: map.serious || 0,
      moderate_count: map.moderate || 0,
      minor_count: map.minor || 0,
      accessibility_score: accessibilityScore,
    });
  },
  // update page issue summary
  async updatePageSummary(siteId: string, crawlJobId: string) {
    const pageBreakdown = await IssueAnalyticsRepository.getPageBreakdown(
      siteId,
      crawlJobId
    );

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
      minor_count: page.minor_count,
    }));

    if (records.length === 0) return;

    await PageIssueSummaryRepository.bulkUpsert(records);
  },
};
