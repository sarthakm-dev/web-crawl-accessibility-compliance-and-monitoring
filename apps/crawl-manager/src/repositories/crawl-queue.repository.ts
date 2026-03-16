import { CrawlQueue } from '@packages/shared-models/crawl-queue.model';

export const CrawlQueueRepository = {
  // create record if not exists
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
      if (err.name !== 'SequelizeUniqueConstraintError') {
        throw err;
      }
    }
  },

  async getNextPending(jobId: string) {
    // get the next pending job
    return await CrawlQueue.findOne({
      where: {
        crawl_job_id: jobId,
        status: 'pending',
      },
      order: [['created_at', 'ASC']],
    });
  },

  async updateStatus(id: string, status: string) {
    // update the status for specified id
    await CrawlQueue.update({ status }, { where: { id } });
  },

  async incrementRetry(id: string) {
    // update retry count for observability
    await CrawlQueue.increment('retry_count', {
      where: { id },
    });
  },
};
