import { CrawlJob } from '@packages/shared-models/crawl-job.model';
import { CrawlQueue } from '@packages/shared-models/crawl-queue.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { Site } from '@packages/shared-models/site.model';
import { User } from '@packages/shared-models/user.model';

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
      include: [
        {
          model: Site,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return {
      data: rows.map(job => ({
        id: job.id,
        status: job.status,
        triggerType: job.trigger_type,
        createdAt: job.created_at,
        site: {
          id: job.Site?.id,
          name: job.Site?.name,
        },
        requestedBy: {
          id: job.User?.id,
          name: job.User?.name,
          email: job.User?.email,
        },
      })),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.max(Math.ceil(count / limit), 1),
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
