import { IssueAnalytics } from "@packages/shared-models/issue-analytics.model";
import { fn, col, literal, Op } from "sequelize";
import type { SeverityBreakdown,PageBreakdown } from "@packages/shared-types/issue.types";

export const IssueAnalyticsRepository = {

  async bulkInsert(records: any[]) {
    return IssueAnalytics.bulkCreate(records);
  },

  async getSeverityBreakdown(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    if (startDate && endDate) {
      where.detected_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return IssueAnalytics.findAll({
      attributes: ["severity", [fn("COUNT", col("id")), "count"]],
      where,
      group: ["severity"],
      raw: true,
    }) as unknown as SeverityBreakdown[];
  },

  async countIssues(siteId: string, crawlJobId?: string) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    return IssueAnalytics.count({ where });
  },

  async getTopPages(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    if (startDate && endDate) {
      where.detected_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return IssueAnalytics.findAll({
      attributes: [
        "page_url",
        [fn("COUNT", col("id")), "issues"]
      ],
      where,
      group: ["page_url"],
      order: [[literal("issues"), "DESC"]],
      limit: 10,
    });
  },

  async getPageBreakdown(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    if (startDate && endDate) {
      where.detected_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    const result = await IssueAnalytics.findAll({
      attributes: [
        "page_id",
        "page_url",

        [literal(`COUNT(id)::int`), "total_issues"],

        [
          literal(`COALESCE(SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END),0)::int`),
          "critical_count",
        ],

        [
          literal(`COALESCE(SUM(CASE WHEN severity = 'serious' THEN 1 ELSE 0 END),0)::int`),
          "serious_count",
        ],

        [
          literal(`COALESCE(SUM(CASE WHEN severity = 'moderate' THEN 1 ELSE 0 END),0)::int`),
          "moderate_count",
        ],

        [
          literal(`COALESCE(SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END),0)::int`),
          "minor_count",
        ],
      ],

      where,
      group: ["page_id", "page_url"],
      raw: true,
    });

    return result as unknown as PageBreakdown[];
  },

  async getIssues(
    siteId: string,
    severity?: string,
    limit = 10,
    offset = 0,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    if (severity) where.severity = severity;

    if (startDate && endDate) {
      where.detected_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return IssueAnalytics.findAndCountAll({
      where,
      limit,
      offset,
      order: [["detected_at", "DESC"]],
    });
  },

  async countPages(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = { site_id: siteId };

    if (crawlJobId) where.crawl_job_id = crawlJobId;

    if (startDate && endDate) {
      where.detected_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return IssueAnalytics.count({
      distinct: true,
      col: "page_id",
      where,
    });
  },
};