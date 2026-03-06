import { SiteRepository } from '../repositories/site.repository';

export const SiteService = {
  async createSite(teamId: string, data: { name: string; baseUrl: string }) {
    return SiteRepository.create(teamId, data.name, data.baseUrl);
  },

  async getAllSites(params: {
    teamId: string;
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    const { rows, count } = await SiteRepository.findAllWithPagination(params);

    const { page, limit } = params;

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
    const site = await SiteRepository.findById(teamId, id);

    if (!site) {
      throw new Error('Site not found');
    }

    return site;
  },

  async deleteSite(teamId: string, id: string) {
    const site = await SiteRepository.findById(teamId, id);

    if (!site) {
      throw new Error('Site not found');
    }

    await SiteRepository.deleteWithJobs(id);
  },
};
