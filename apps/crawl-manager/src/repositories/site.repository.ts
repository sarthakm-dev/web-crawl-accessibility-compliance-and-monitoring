import { Site } from '../models';

export const SiteRepository = {
  async findActiveSite(siteId: string) {
    return Site.findOne({
      where: {
        id: siteId,
        is_active: true,
      },
    });
  },
};
