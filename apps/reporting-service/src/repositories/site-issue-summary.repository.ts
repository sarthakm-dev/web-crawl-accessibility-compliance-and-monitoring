import { SiteIssueSummary } from '@packages/shared-models/site-issue-summary.model';

export const SiteIssueSummaryRepository = {
  async upsert(data: any) {
    return await SiteIssueSummary.upsert(data);
  },

  async getBySite(siteId: string) {
    return await SiteIssueSummary.findOne({
      where: { site_id: siteId },
    });
  },
};
