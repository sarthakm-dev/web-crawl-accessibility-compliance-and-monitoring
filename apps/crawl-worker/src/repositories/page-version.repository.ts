import { PageVersion } from '@packages/shared-models/page-version.model';

export const PageVersionRepository = {
  async create(data: {
    page_id: string;
    crawl_job_id: string;
    http_status: number;
    content_hash: string;
    title: string;
    content_size: number;
    html_path: string;
    crawled_at?: Date;
  }) {
    return PageVersion.create({
      ...data,
      crawled_at: new Date(),
    });
  },
  async findByHash(hash: string) {
    // find page by hash to handle duplicates
    return PageVersion.findOne({
      where: { content_hash: hash },
      order: [['crawled_at', 'DESC']],
    });
  },
};
