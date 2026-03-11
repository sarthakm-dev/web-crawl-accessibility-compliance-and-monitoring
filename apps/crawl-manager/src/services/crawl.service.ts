import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { SiteRepository } from '../repositories/site.repository';
import { publishCrawlJob } from '../publishers/crawl.publishers';

export const CrawlService = {
  async triggerCrawl(siteId: string, requestedBy: string, triggerType: string) {
    const site = await SiteRepository.findActiveSite(siteId);
    if (!site) {
      throw new Error('Site not found or inactive');
    }
    // Create new Crawl job
    const job = await CrawlJobRepository.create({
      site_id: siteId,
      requested_by: requestedBy,
      trigger_type: triggerType,
    });
    // Publish job to RabbitMQ
    await publishCrawlJob({
      jobId: job.id,
      siteId,
      baseUrl: site.base_url,
    });
    return job;
  },
  async getCrawlById(id: string) {
    const crawl = await CrawlJobRepository.findById(id);

    if (!crawl) {
      throw new Error('Crawl job not found');
    }
    // Get stats of the crawled job
    const stats = await CrawlJobRepository.getStats(id);

    return {
      ...crawl.toJSON(),
      stats,
    };
  },

  async getAllCrawls(params: {
    siteId?: string;
    status?: string;
    page: number;
    limit: number;
  }) {
    const { siteId, status, page, limit } = params;

    const filters: any = {};
    // Add filter config
    if (siteId) filters.site_id = siteId;
    if (status) filters.status = status;

    return CrawlJobRepository.findAllPaginated({
      filters,
      page,
      limit,
    });
  },
  async bulkDeleteCrawls(ids: string[]) {
    const deleted = await CrawlJobRepository.bulkDelete(ids);
    if (!deleted) {
      throw new Error('Crawl jobs not found');
    }
    return deleted;
  },
};
