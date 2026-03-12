import { IssueAnalytics } from '@packages/shared-models/issue-analytics.model';
import { fn, col, literal } from 'sequelize';
import type {
  SeverityBreakdown,
  PageBreakdown,
} from '@packages/shared-types/issue.types';
export const IssueAnalyticsRepository = {
  async bulkInsert(records: any[]) {
    return await IssueAnalytics.bulkCreate(records);
  },

  async getSeverityBreakdown(siteId: string, crawlJobId?: string) {
    const result = await IssueAnalytics.findAll({
      attributes: ['severity', [fn('COUNT', col('id')), 'count']],
      where: {
        site_id: siteId,
        crawl_job_id: crawlJobId,
      },
      group: ['severity'],
      raw: true,
    });
    return result as unknown as SeverityBreakdown[];
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
  async getPageBreakdown(siteId: string, crawlJobId: string) {
  const result = await IssueAnalytics.findAll({
    attributes: [
      "page_id",
      "page_url",

      [literal(`COUNT(id)::int`), "total_issues"],

      [
        literal(
          `COALESCE(SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END),0)::int`
        ),
        "critical_count",
      ],

      [
        literal(
          `COALESCE(SUM(CASE WHEN severity = 'serious' THEN 1 ELSE 0 END),0)::int`
        ),
        "serious_count",
      ],

      [
        literal(
          `COALESCE(SUM(CASE WHEN severity = 'moderate' THEN 1 ELSE 0 END),0)::int`
        ),
        "moderate_count",
      ],

      [
        literal(
          `COALESCE(SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END),0)::int`
        ),
        "minor_count",
      ],
    ],

    where: {
      site_id: siteId,
      crawl_job_id: crawlJobId,
    },

    group: ["page_id", "page_url"],

    raw: true,
  });

  return result as unknown as PageBreakdown[];
},
  async getIssues(siteId: string, severity?: string, limit = 50, offset = 0) {
    return IssueAnalytics.findAndCountAll({
      where: {
        site_id: siteId,
        ...(severity && { severity }),
      },
      limit,
      offset,
      order: [['detected_at', 'DESC']],
    });
  },
  async countPages(siteId: string, crawlJobId: string) {
    return IssueAnalytics.count({
      distinct: true,
      col: 'page_id',
      where: {
        site_id: siteId,
        crawl_job_id: crawlJobId,
      },
    });
  },
};
