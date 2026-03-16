import { CrawlJob } from '@packages/shared-models/crawl-job.model';

export const CrawlJobRepository = {
  async create(data: {
    site_id: string;
    requested_by: string;
    trigger_type: string;
  }) {
    // add new crawl job to record
    return CrawlJob.create({
      site_id: data.site_id,
      requested_by: data.requested_by,
      trigger_type: data.trigger_type,
      status: 'pending',
    });
  },

  async findById(id: string) {
    // find a crawl job by id
    return CrawlJob.findByPk(id);
  },

  async updateStatus(id: string, status: string) {
    // update status of crawl job
    return CrawlJob.update({ status }, { where: { id } });
  },
};
