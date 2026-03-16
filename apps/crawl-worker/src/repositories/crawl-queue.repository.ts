import { CrawlQueue } from '@packages/shared-models/crawl-queue.model';

export const CrawlQueueRepository = {
  async createIfNotExists(data: {
    crawl_job_id: string;
    url: string;
    status: string;
    discovered_from: string | null;
    retry_count: number;
  }) {
    try {
      await CrawlQueue.upsert(data);
    } catch (err: any) {
      // prevent sequelize unique constraint ass it is expected behavious
      if (err.name !== 'SequelizeUniqueConstraintError') {
        throw err;
      }
    }
  },

  async getNextPending(jobId: string) {
    // find next pending job in queue
    return await CrawlQueue.findOne({
      where: {
        crawl_job_id: jobId,
        status: 'pending',
      },
      order: [['created_at', 'ASC']],
    });
  },

  async updateStatus(id: string, status: string) {
    // update queue status
    await CrawlQueue.update({ status }, { where: { id } });
  },

  async incrementRetry(id: string) {
    // increment retry count
    await CrawlQueue.increment('retry_count', {
      where: { id },
    });
  },
};
