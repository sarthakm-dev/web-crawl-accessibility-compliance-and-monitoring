import { SiteDailyMetrics } from '@packages/shared-models/site-daily-metrics.model';

export const SiteDailyMetricsRepository = {
  async create(data: any) {
    // create new record in site daily metrics
    return SiteDailyMetrics.create(data);
  },

  async findBySiteAndDate(siteId: string, date: string) {
    // find the metric of specified site by siteId and date
    return SiteDailyMetrics.findOne({
      where: {
        site_id: siteId,
        date,
      },
    });
  },
};
