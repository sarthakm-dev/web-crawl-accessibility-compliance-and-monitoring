import { Site } from './site.model';
import { CrawlJob } from './crawl-job.model';
import { CrawlQueue } from './crawl-queue.model';
import { Page } from './page.model';

export function setupAssociations() {
  Site.hasMany(CrawlJob, { foreignKey: 'site_id' });
  CrawlJob.belongsTo(Site, { foreignKey: 'site_id' });

  CrawlJob.hasMany(CrawlQueue, { foreignKey: 'crawl_job_id' });
  CrawlQueue.belongsTo(CrawlJob, { foreignKey: 'crawl_job_id' });

  Site.hasMany(Page, { foreignKey: 'site_id' });
  Page.belongsTo(Site, { foreignKey: 'site_id' });
}
