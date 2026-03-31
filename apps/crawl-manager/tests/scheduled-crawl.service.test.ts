import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScheduledCrawlService } from '../src/services/scheduled-crawl.service';
import { SiteRepository } from '../src/repositories/site.repository';
import { CrawlJobRepository } from '../src/repositories/crawl-job.repository';
import { CrawlService } from '../src/services/crawl.service';

vi.mock('../src/repositories/site.repository');
vi.mock('../src/repositories/crawl-job.repository');
vi.mock('../src/services/crawl.service');
vi.mock('@packages/shared-config/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ScheduledCrawlService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ScheduledCrawlService.stop();
  });

  it('starts scheduled crawls for due sites', async () => {
    (SiteRepository.findScheduledByTime as any).mockResolvedValue([
      { id: 'site-1' },
    ]);
    (CrawlJobRepository.hasActiveJob as any).mockResolvedValue(false);
    (CrawlJobRepository.hasScheduledJobInWindow as any).mockResolvedValue(
      false
    );

    await ScheduledCrawlService.runTick(new Date('2026-03-31T09:30:00'));

    expect(SiteRepository.findScheduledByTime).toHaveBeenCalledWith('09:30');
    expect(CrawlService.triggerCrawl).toHaveBeenCalledWith(
      'site-1',
      null,
      'scheduled'
    );
  });

  it('skips sites with active crawls', async () => {
    (SiteRepository.findScheduledByTime as any).mockResolvedValue([
      { id: 'site-1' },
    ]);
    (CrawlJobRepository.hasActiveJob as any).mockResolvedValue(true);

    await ScheduledCrawlService.runTick(new Date('2026-03-31T09:30:00'));

    expect(CrawlService.triggerCrawl).not.toHaveBeenCalled();
  });

  it('skips sites already scheduled today', async () => {
    (SiteRepository.findScheduledByTime as any).mockResolvedValue([
      { id: 'site-1' },
    ]);
    (CrawlJobRepository.hasActiveJob as any).mockResolvedValue(false);
    (CrawlJobRepository.hasScheduledJobInWindow as any).mockResolvedValue(true);

    await ScheduledCrawlService.runTick(new Date('2026-03-31T09:30:00'));

    expect(CrawlService.triggerCrawl).not.toHaveBeenCalled();
  });
});
