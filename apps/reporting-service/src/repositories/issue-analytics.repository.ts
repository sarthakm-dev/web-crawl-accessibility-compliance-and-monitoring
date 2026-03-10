import { IssueAnalytics } from '@packages/shared-models/issue-analytics.model';
import { fn, col, literal } from 'sequelize';

export const IssueAnalyticsRepository = {
  async bulkInsert(records: any[]) {
    return await IssueAnalytics.bulkCreate(records);
  },

  async getSeverityBreakdown(siteId: string, crawlJobId: string) {
    return await IssueAnalytics.findAll({
      attributes: ['severity', [fn('COUNT', col('id')), 'count']],
      where: {
        site_id: siteId,
        crawl_job_id: crawlJobId,
      },
      group: ['severity'],
      raw: true,
    });
  },
  async countIssues(siteId: string, crawlJobId: string) {
    return await IssueAnalytics.count({
      where: {
        site_id: siteId,
        crawl_job_id: crawlJobId,
      },
    });
  },
  async getTopPages(siteId: string) {
    return await IssueAnalytics.findAll({
      attributes: ['page_url', [fn('COUNT', col('id')), 'issues']],
      where: { site_id: siteId },
      group: ['page_url'],
      order: [[literal('issues'), 'DESC']],
      limit: 10,
    });
  },
};
