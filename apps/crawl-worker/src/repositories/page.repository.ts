import { Page } from '@packages/shared-models/page.model';

export const PageRepository = {
  async findByUrl(site_id: string, url: string) {
    return Page.findOne({
      where: { site_id, url },
    });
  },

  async create(site_id: string, url: string) {
    return Page.create({
      site_id,
      url,
      first_discovered_at: new Date(),
      last_seen_at: new Date(),
      status: 'active',
    });
  },

  async updateLastSeen(id: string) {
    return Page.update({ last_seen_at: new Date() }, { where: { id } });
  },

  async upsert(data: {
    site_id: string;
    url: string;
    last_seen_at?: Date;
    status?: string;
  }) {
    const [page, created] = await Page.findOrCreate({
      where: {
        site_id: data.site_id,
        url: data.url,
      },
      defaults: {
        site_id: data.site_id,
        url: data.url,
        first_discovered_at: new Date(),
        last_seen_at: data.last_seen_at ?? new Date(),
        status: data.status ?? 'active',
      },
    });

    if (!created) {
      await page.update({
        last_seen_at: data.last_seen_at ?? new Date(),
        status: data.status ?? page.status,
      });
    }

    return page;
  },
};
