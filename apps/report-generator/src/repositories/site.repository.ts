import { Site } from '@packages/shared-models/site.model';


export const SiteRepository = {
  
  async findById(id: string) {
    return Site.findOne({
      where: { id },
    });
  }
};
