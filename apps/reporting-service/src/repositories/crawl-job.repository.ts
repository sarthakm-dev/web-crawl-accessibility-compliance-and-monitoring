import { CrawlJob } from "@packages/shared-models/crawl-job.model";
import { Op } from "sequelize";

export const CrawlJobRepository = {

  async findLatest(siteId: string) {
    return CrawlJob.findOne({
      where: { site_id: siteId },
      order: [["created_at", "DESC"]],
    });
  },

  async findByDate(siteId: string, start: Date, end: Date) {
    return CrawlJob.findOne({
      where: {
        site_id: siteId,
        ...(start &&
          end && {
            created_at: {
              [Op.between]: [start, end],
            },
          }),
      },
      order: [["created_at", "DESC"]],
    });
  }

};