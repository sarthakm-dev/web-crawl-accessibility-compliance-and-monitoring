import { Site } from '@packages/shared-models/site.model';

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
