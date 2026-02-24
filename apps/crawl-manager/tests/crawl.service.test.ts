import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlService } from '../src/services/crawl.service';
import { SiteRepository } from '../src/repositories/site.repository';
import { CrawlJobRepository } from '../src/repositories/crawl-job.repository';
import { publishCrawlJob } from '../src/publishers/crawl.publishers';

vi.mock('../src/repositories/site.repository');
vi.mock('../src/repositories/crawl-job.repository');
vi.mock('../src/publishers/crawl.publishers');

describe('CrawlService.triggerCrawl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create crawl job and publish message', async () => {
    const mockSite = {
      id: 'site-1',
      base_url: 'https://example.com',
    };

    const mockJob = {
      id: 'job-123',
      site_id: 'site-1',
    };

    (SiteRepository.findActiveSite as any).mockResolvedValue(mockSite);
    (CrawlJobRepository.create as any).mockResolvedValue(mockJob);
    (publishCrawlJob as any).mockResolvedValue(undefined);

    const result = await CrawlService.triggerCrawl(
      'site-1',
      'user-1',
      'manual'
    );

    expect(SiteRepository.findActiveSite).toHaveBeenCalledWith('site-1');

    expect(CrawlJobRepository.create).toHaveBeenCalledWith({
      site_id: 'site-1',
      requested_by: 'user-1',
      trigger_type: 'manual',
    });

    expect(publishCrawlJob).toHaveBeenCalledWith({
      jobId: 'job-123',
      siteId: 'site-1',
      baseUrl: 'https://example.com',
    });

    expect(result).toEqual(mockJob);
  });

  it('should throw if site is not found', async () => {
    (SiteRepository.findActiveSite as any).mockResolvedValue(null);

    await expect(
      CrawlService.triggerCrawl('bad-site', 'user-1', 'manual')
    ).rejects.toThrow('Site not found or inactive');

    expect(CrawlJobRepository.create).not.toHaveBeenCalled();
    expect(publishCrawlJob).not.toHaveBeenCalled();
  });

  it('should throw if job creation fails', async () => {
    const mockSite = {
      id: 'site-1',
      base_url: 'https://example.com',
    };

    (SiteRepository.findActiveSite as any).mockResolvedValue(mockSite);
    (CrawlJobRepository.create as any).mockRejectedValue(
      new Error('DB failure')
    );

    await expect(
      CrawlService.triggerCrawl('site-1', 'user-1', 'manual')
    ).rejects.toThrow('DB failure');

    expect(publishCrawlJob).not.toHaveBeenCalled();
  });
});
