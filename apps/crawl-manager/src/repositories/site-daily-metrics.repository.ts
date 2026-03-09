import { SiteDailyMetrics } from '@packages/shared-models/site-daily-metrics.model';

export const SiteDailyMetricsRepository = {
  async create(data: any) {
    return SiteDailyMetrics.create(data);
  },

  async findBySiteAndDate(siteId: string, date: string) {
    return SiteDailyMetrics.findOne({
      where: {
        site_id: siteId,
        date,
      },
    });
  },
};
