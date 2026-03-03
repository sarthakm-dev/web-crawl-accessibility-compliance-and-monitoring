import { Op } from 'sequelize';
import { Site } from '@packages/shared-models/site.model';
import { CrawlJob } from '@packages/shared-models/crawl-job.model';

export const SiteRepository = {
  async findActiveSite(siteId: string) {
    return Site.findOne({
      where: {
        id: siteId,
        is_active: true,
      },
    });
  },
  create(teamId: string, name: string, baseUrl: string) {
    return Site.create({
      team_id: teamId,
      name,
      base_url: baseUrl,
      is_active: true,
    });
  },

  findAllWithPagination(params: {
    teamId: string;
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    const { teamId, page, limit, search, status } = params;

    const offset = (page - 1) * limit;

    const where: any = {
      team_id: teamId,
    };

    if (search?.trim()) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (status && status !== 'all') {
      where.is_active = status === 'active';
    }

    return Site.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
  },

  findById(teamId: string, id: string) {
    return Site.findOne({
      where: { id, team_id: teamId },
    });
  },

  async deleteWithJobs(id: string) {
    await CrawlJob.destroy({
      where: { site_id: id },
    });

    return Site.destroy({
      where: { id },
    });
  },
};
