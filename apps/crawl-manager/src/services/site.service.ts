import { Op } from 'sequelize';
import { Site } from '@packages/shared-models/site.model';
import { CrawlJob } from '@packages/shared-models/crawl-job.model';

export const SiteService = {
  async createSite(
    teamId: string,
    data: {
      name: string;
      baseUrl: string;
    }
  ) {
    return Site.create({
      team_id: teamId,
      name: data.name,
      base_url: data.baseUrl,
      is_active: true,
    });
  },

  async getAllSites(params: {
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

    if (search && search.trim() !== '') {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (status && status !== 'all') {
      where.is_active = status === 'active';
    }

    const { rows, count } = await Site.findAndCountAll({
      where,
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
        totalPages: Math.max(Math.ceil(count / limit), 1),
      },
    };
  },

  async getSiteById(teamId: string, id: string) {
    const site = await Site.findOne({
      where: { id, team_id: teamId },
    });

    if (!site) {
      throw new Error('Site not found');
    }

    return site;
  },
  async deleteSite(teamId: string, id: string) {
    const site = await Site.findOne({
      where: { id, team_id: teamId },
    });

    if (!site) {
      throw new Error('Site not found');
    }

    await CrawlJob.destroy({
      where: { site_id: id },
    });

    await site.destroy();
  },
};
