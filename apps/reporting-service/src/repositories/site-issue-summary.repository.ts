import { SiteIssueSummary } from "@packages/shared-models/site-issue-summary.model";
import { Op } from "sequelize";

export const SiteIssueSummaryRepository = {

  async upsert(data: any) {
    return SiteIssueSummary.upsert(data, {
      conflictFields: ["site_id", "crawl_job_id"],
    });
  },

  async getSiteSummary(
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
    else if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return SiteIssueSummary.findOne({
      where,
      order: [["created_at", "DESC"]],
      raw: true,
    });
  },

};