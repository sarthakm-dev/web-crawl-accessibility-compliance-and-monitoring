import { SiteIssueSummary } from '@packages/shared-models/site-issue-summary.model';

export const SiteIssueSummaryRepository = {
  async upsert(data: any) {
    return await SiteIssueSummary.upsert(data, {
      conflictFields: ['site_id', 'crawl_job_id'],
    });
  },

  async getBySite(siteId: string) {
    return await SiteIssueSummary.findOne({
      where: { site_id: siteId },
    });
  },

  async getSiteSummary(siteId: string, crawlJobId?: string) {
    return SiteIssueSummary.findOne({
      where: {
        site_id: siteId,
        ...(crawlJobId && { crawl_job_id: crawlJobId }),
      },
      order: [['created_at', 'DESC']],
    });
  },
};
