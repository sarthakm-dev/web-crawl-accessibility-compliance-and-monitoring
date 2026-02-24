import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { SiteRepository } from '../repositories/site.repository';
import { publishCrawlJob } from '../publishers/crawl.publishers';

export const CrawlService = {
  async triggerCrawl(siteId: string, requestedBy: string, triggerType: string) {
    const site = await SiteRepository.findActiveSite(siteId);
    if (!site) {
      throw new Error('Site not found or inactive');
    }

    const job = await CrawlJobRepository.create({
      site_id: siteId,
      requested_by: requestedBy,
      trigger_type: triggerType,
    });
    await publishCrawlJob({
      jobId: job.id,
      siteId,
      baseUrl: site.base_url,
    });
    return job;
  },
};
