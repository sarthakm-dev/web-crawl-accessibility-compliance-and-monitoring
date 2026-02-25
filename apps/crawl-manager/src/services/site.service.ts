import { Site } from '../models/site.model';

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

  async getAllSites(params: { teamId: string; page: number; limit: number }) {
    const { teamId, page, limit } = params;

    const offset = (page - 1) * limit;

    const { rows, count } = await Site.findAndCountAll({
      where: { team_id: teamId },
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

  async getSiteById(teamId: string, id: string) {
    const site = await Site.findOne({
      where: { id, team_id: teamId },
    });

    if (!site) {
      throw new Error('Site not found');
    }

    return site;
  },
};
