import { Op } from 'sequelize';
import { Site } from '@packages/shared-models/site.model';
import { CrawlJob } from '@packages/shared-models/crawl-job.model';

export const SiteRepository = {
  async findActiveSite(siteId: string) {
    // find single active site
    return Site.findOne({
      where: {
        id: siteId,
        is_active: true,
      },
    });
  },
  async create(
    teamId: string,
    name: string,
    baseUrl: string,
    scheduledCrawlTime?: string
  ) {
    // add new record to table
    return Site.create({
      team_id: teamId,
      name,
      base_url: baseUrl,
      is_active: true,
      scheduled_crawl_time: scheduledCrawlTime || null,
    });
  },

  async findAllWithPagination(params: {
    teamId: string;
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    // get params for pagination
    const { teamId, page, limit, search, status } = params;
    // setup offset
    const offset = (page - 1) * limit;

    const where: any = {
      team_id: teamId,
    };
    // if search not empty
    if (search?.trim()) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (status && status !== 'all') {
      where.is_active = status === 'active';
    }
    // get data based on condition
    return Site.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
  },

  async findById(teamId: string, id: string) {
    // find a site by its id
    return Site.findOne({
      where: { id, team_id: teamId },
    });
  },

  async findScheduledByTime(scheduledTime: string) {
    return Site.findAll({
      where: {
        is_active: true,
        scheduled_crawl_time: scheduledTime,
      },
    });
  },

  async deleteWithJobs(id: string) {
    // delete specified crawl job
    await CrawlJob.destroy({
      where: { site_id: id },
    });

    return Site.destroy({
      where: { id },
    });
  },
  async bulkDelete(teamId: string, ids: string[]) {
    // delete multiple sites
    return Site.destroy({
      where: {
        id: ids,
        team_id: teamId,
      },
    });
  },
};
