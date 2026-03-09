import { Site } from '@packages/shared-models/site.model';
import { CrawlJob } from '@packages/shared-models/crawl-job.model';
import { IssueInstance } from '@packages/shared-models/issue-instance.model';
import { SiteDailyMetrics } from '@packages/shared-models/site-daily-metrics.model';
import { CrawlJobRepository } from './crawl-job.repository';

export const DashboardRepository = {
  async getActiveSites() {
    return Site.count({
      where: { is_active: true },
    });
  },

  async getActiveCrawls() {
    return CrawlJob.count({
      where: { status: 'running' },
    });
  },

  async getOpenIssues() {
    return IssueInstance.count({
      where: { current_status: 'open' },
    });
  },

  async getLatestAccessibilityScore(siteId?: string) {
    const where: any = {};
    if (siteId) where.site_id = siteId;

    return SiteDailyMetrics.findOne({
      where,
      order: [['created_at', 'DESC']],
    });
  },

  async getAccessibilityTrend(siteId?: string) {
    const where: any = {};
    if (siteId) where.site_id = siteId;

    return SiteDailyMetrics.findAll({
      where,
      attributes: ['created_at', 'accessibility_score'],
      order: [['created_at', 'ASC']],
    });
  },

  async getIssuesBreakdown() {
    const issues = await IssueInstance.findAll({
      attributes: ['impact'],
    });

    let critical = 0;
    let serious = 0;
    let moderate = 0;
    let minor = 0;

    issues.forEach(issue => {
      switch (issue.impact) {
        case 'critical':
          critical++;
          break;
        case 'serious':
          serious++;
          break;
        case 'moderate':
          moderate++;
          break;
        default:
          minor++;
      }
    });

    return { critical, serious, moderate, minor };
  },

  async getLatestCrawls(): Promise<any[]> {
    const jobs = await CrawlJob.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Site,
          attributes: ['name'],
        },
      ],
    });

    const results = await Promise.all(
      jobs.map(async job => {
        const stats = await CrawlJobRepository.getStats(job.id);

        return {
          ...job.toJSON(),
          pages_crawled: stats.totalPages,
        };
      })
    );

    return results;
  },
};
