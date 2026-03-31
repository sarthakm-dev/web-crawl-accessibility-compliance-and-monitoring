import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlService } from '../src/services/crawl.service';
import { CrawlJobRepository } from '../src/repositories/crawl-job.repository';
import { SiteRepository } from '../src/repositories/site.repository';
import { publishCrawlJob } from '../src/publishers/crawl.publishers';

vi.mock('../src/repositories/crawl-job.repository');
vi.mock('../src/repositories/site.repository');
vi.mock('../src/publishers/crawl.publishers');

describe('CrawlService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create crawl job and publish event', async () => {
    const mockSite = {
      id: 'site-1',
      base_url: 'https://example.com',
    };

    const mockJob = {
      id: 'job-1',
      site_id: 'site-1',
      requested_by: 'user-1',
      trigger_type: 'manual',
    };

    (SiteRepository.findActiveSite as any).mockResolvedValue(mockSite);
    (CrawlJobRepository.create as any).mockResolvedValue(mockJob);

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
      jobId: 'job-1',
      siteId: 'site-1',
      baseUrl: 'https://example.com',
    });

    expect(result).toEqual(mockJob);
  });

  it('should create scheduled crawl without a requesting user', async () => {
    const mockSite = {
      id: 'site-1',
      base_url: 'https://example.com',
    };

    const mockJob = {
      id: 'job-2',
      site_id: 'site-1',
      requested_by: null,
      trigger_type: 'scheduled',
    };

    (SiteRepository.findActiveSite as any).mockResolvedValue(mockSite);
    (CrawlJobRepository.create as any).mockResolvedValue(mockJob);

    const result = await CrawlService.triggerCrawl('site-1', null, 'scheduled');

    expect(CrawlJobRepository.create).toHaveBeenCalledWith({
      site_id: 'site-1',
      requested_by: null,
      trigger_type: 'scheduled',
    });
    expect(result).toEqual(mockJob);
  });

  it('should throw error if site not found or inactive', async () => {
    (SiteRepository.findActiveSite as any).mockResolvedValue(null);

    await expect(
      CrawlService.triggerCrawl('site-1', 'user-1', 'manual')
    ).rejects.toThrow('Site not found or inactive');
  });

  it('should return crawl with stats', async () => {
    const mockCrawl = {
      id: 'job-1',
      status: 'completed',
      toJSON: vi.fn().mockReturnValue({
        id: 'job-1',
        status: 'completed',
      }),
    };

    const mockStats = {
      pages: 10,
      issues: 2,
    };

    (CrawlJobRepository.findById as any).mockResolvedValue(mockCrawl);
    (CrawlJobRepository.getStats as any).mockResolvedValue(mockStats);

    const result = await CrawlService.getCrawlById('job-1');

    expect(CrawlJobRepository.findById).toHaveBeenCalledWith('job-1');
    expect(CrawlJobRepository.getStats).toHaveBeenCalledWith('job-1');

    expect(result).toEqual({
      id: 'job-1',
      status: 'completed',
      stats: mockStats,
    });
  });

  it('should throw if crawl job not found', async () => {
    (CrawlJobRepository.findById as any).mockResolvedValue(null);

    await expect(CrawlService.getCrawlById('job-1')).rejects.toThrow(
      'Crawl job not found'
    );
  });

  it('should return paginated crawls with filters', async () => {
    const mockResult = {
      data: [],
      pagination: {},
    };

    (CrawlJobRepository.findAllPaginated as any).mockResolvedValue(mockResult);

    const result = await CrawlService.getAllCrawls({
      siteId: 'site-1',
      status: 'completed',
      page: 1,
      limit: 10,
    });

    expect(CrawlJobRepository.findAllPaginated).toHaveBeenCalledWith({
      filters: {
        site_id: 'site-1',
        status: 'completed',
      },
      page: 1,
      limit: 10,
    });

    expect(result).toEqual(mockResult);
  });

  it('should work without optional filters', async () => {
    const mockResult = { data: [], pagination: {} };

    (CrawlJobRepository.findAllPaginated as any).mockResolvedValue(mockResult);

    const result = await CrawlService.getAllCrawls({
      page: 1,
      limit: 10,
    });

    expect(CrawlJobRepository.findAllPaginated).toHaveBeenCalledWith({
      filters: {},
      page: 1,
      limit: 10,
    });

    expect(result).toEqual(mockResult);
  });
  it('should bulk delete crawl jobs', async () => {
    const ids = ['job-1', 'job-2'];

    (CrawlJobRepository.bulkDelete as any).mockResolvedValue(2);

    await CrawlService.bulkDeleteCrawls(ids);

    expect(CrawlJobRepository.bulkDelete).toHaveBeenCalledWith(ids);
  });
  it('should throw if no crawl jobs deleted', async () => {
    const ids = ['job-1', 'job-2'];

    (CrawlJobRepository.bulkDelete as any).mockResolvedValue(0);

    await expect(CrawlService.bulkDeleteCrawls(ids)).rejects.toThrow(
      'Crawl jobs not found'
    );
  });
});
