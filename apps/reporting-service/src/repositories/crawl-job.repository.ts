import { CrawlJob } from "@packages/shared-models/crawl-job.model";

export const CrawlJobRepository = {
  async findLatest(siteId: string) {
    return CrawlJob.findOne({
      where: { site_id: siteId },
      order: [["created_at", "DESC"]],
    });
  },
};