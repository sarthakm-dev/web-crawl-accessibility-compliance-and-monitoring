import { PageIssueSummary } from "@packages/shared-models/page-issue-summary.model";
import { Op } from "sequelize";

export const PageIssueSummaryRepository = {

  async upsert(data: any) {
    return PageIssueSummary.upsert(data);
  },

  async bulkUpsert(records: any[]) {
    return PageIssueSummary.bulkCreate(records, {
      updateOnDuplicate: [
        "total_issues",
        "critical_count",
        "serious_count",
        "moderate_count",
        "minor_count",
      ],
    });
  },

  async getTopPages(
    siteId: string,
    crawlJobId?: string,
    startDate?: Date,
    endDate?: Date
  ) {

    const where: any = {
      site_id: siteId,
    };

    if (crawlJobId) {
      where.crawl_job_id = crawlJobId;
    }

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return PageIssueSummary.findAll({
      attributes: ["page_url", "total_issues", "critical_count"],
      where,
      order: [["total_issues", "DESC"]],
      limit: 10,
      raw: true,
    });
  },

};