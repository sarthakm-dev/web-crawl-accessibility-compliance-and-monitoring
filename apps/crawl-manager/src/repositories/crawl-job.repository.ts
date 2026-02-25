import { CrawlJob } from '../models/crawl-job.model';
import { CrawlQueue } from '../models/crawl-queue.model';
import { PageVersion } from '../models/page-version.model';

export const CrawlJobRepository = {
  async create(data: {
    site_id: string;
    requested_by: string;
    trigger_type: string;
  }) {
    return CrawlJob.create({
      site_id: data.site_id,
      requested_by: data.requested_by,
      trigger_type: data.trigger_type,
      status: 'pending',
    });
  },

  async findById(id: string) {
    return CrawlJob.findByPk(id);
  },

  async findAllPaginated({
    filters,
    page,
    limit,
  }: {
    filters: any;
    page: number;
    limit: number;
  }) {
    const offset = (page - 1) * limit;

    const { rows, count } = await CrawlJob.findAndCountAll({
      where: filters,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
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
