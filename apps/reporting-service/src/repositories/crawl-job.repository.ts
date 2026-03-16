import { CrawlJob } from '@packages/shared-models/crawl-job.model';
import { CrawlQueue } from '@packages/shared-models/crawl-queue.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { Op } from 'sequelize';

export const CrawlJobRepository = {
  async findLatest(siteId: string) {
    return CrawlJob.findOne({
      where: { site_id: siteId },
      order: [['created_at', 'DESC']],
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
      order: [['created_at', 'DESC']],
    });
  },
  async getStats(jobId: string) {
    const totalPages = await PageVersion.count({
      where: { crawl_job_id: jobId },
    });

    const failed = await CrawlQueue.count({
      where: { crawl_job_id: jobId, status: 'failed' },
    });

    const pending = await CrawlQueue.count({
      where: { crawl_job_id: jobId, status: 'pending' },
    });

    const completed = await CrawlQueue.count({
      where: { crawl_job_id: jobId, status: 'completed' },
    });

    return {
      totalPages,
      failed,
      pending,
      completed,
    };
  },
};
