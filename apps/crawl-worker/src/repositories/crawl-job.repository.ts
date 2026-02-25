import { CrawlJob } from '../models/crawl-job.model';

export const CrawlJobRepository = {
  async create(data: {
    site_id: string;
    requested_by: string;
    trigger_type: string;
  }) {
    return CrawlJob.create({
      site_id: data.site_id,
      requested_by: data.requested_by,
      trigger_type: data.trigger_type,
      status: 'pending',
    });
  },

  async findById(id: string) {
    return CrawlJob.findByPk(id);
  },

  async updateStatus(id: string, status: string) {
    return CrawlJob.update({ status }, { where: { id } });
  },
};
