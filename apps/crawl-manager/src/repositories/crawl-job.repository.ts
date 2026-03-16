import { CrawlJob } from '@packages/shared-models/crawl-job.model';
import { CrawlQueue } from '@packages/shared-models/crawl-queue.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { Site } from '@packages/shared-models/site.model';
import { User } from '@packages/shared-models/user.model';
import { Op } from 'sequelize';

export const CrawlJobRepository = {
  async create(data: {
    site_id: string;
    requested_by: string;
    trigger_type: string;
  }) {
    // addnew record in crawl job repository
    return CrawlJob.create({
      site_id: data.site_id,
      requested_by: data.requested_by,
      trigger_type: data.trigger_type,
      status: 'pending',
    });
  },

  async findById(id: string) {
    // find crawl job by id
    return CrawlJob.findByPk(id);
  },

  async findAllPaginated({
    filters,
    page,
    limit,
    search,
  }: {
    filters: any;
    page: number;
    limit: number;
    search?: string;
  }) {
    // setup offset fr pagination
    const offset = (page - 1) * limit;
    // add filters
    const where: any = { ...filters };
    // get rows based on specified filters
    const { rows, count } = await CrawlJob.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Site,
          attributes: ['id', 'name'],
          where: search
            ? {
                name: {
                  [Op.iLike]: `%${search}%`,
                },
              }
            : undefined,
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
    // get total pages
    const totalPages = await PageVersion.count({
      where: { crawl_job_id: jobId },
    });
    // get total failed pages
    const failed = await CrawlQueue.count({
      where: { crawl_job_id: jobId, status: 'failed' },
    });
    // get total pending pages
    const pending = await CrawlQueue.count({
      where: { crawl_job_id: jobId, status: 'pending' },
    });
    // get total pages completed
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
  async bulkDelete(ids: string[]) {
    // delete multiple rows
    return CrawlJob.destroy({
      where: {
        id: ids,
      },
    });
  },
};
