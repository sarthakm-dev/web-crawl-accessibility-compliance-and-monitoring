import { logger } from '@packages/shared-config/logger';
import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { SiteRepository } from '../repositories/site.repository';
import { CrawlService } from './crawl.service';

const formatLocalTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

const getLocalDayBounds = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

export const ScheduledCrawlService = {
  intervalHandle: null as NodeJS.Timeout | null,
  isTickRunning: false,

  async runTick(date = new Date()) {
    if (this.isTickRunning) return;

    this.isTickRunning = true;

    try {
      const scheduledTime = formatLocalTime(date);
      const sites = await SiteRepository.findScheduledByTime(scheduledTime);
      const { start, end } = getLocalDayBounds(date);

      for (const site of sites) {
        const hasActiveJob = await CrawlJobRepository.hasActiveJob(site.id);
        if (hasActiveJob) {
          continue;
        }

        const alreadyScheduledToday =
          await CrawlJobRepository.hasScheduledJobInWindow(site.id, start, end);
        if (alreadyScheduledToday) {
          continue;
        }

        await CrawlService.triggerCrawl(site.id, null, 'scheduled');
        logger.info(
          `Scheduled crawl started for site ${site.id} at ${scheduledTime}`
        );
      }
    } catch (error) {
      logger.error({ error }, 'Scheduled crawl tick failed');
    } finally {
      this.isTickRunning = false;
    }
  },

  start() {
    if (this.intervalHandle) {
      return;
    }

    void this.runTick();
    this.intervalHandle = setInterval(() => {
      void this.runTick();
    }, 60_000);
  },

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.isTickRunning = false;
  },
};
