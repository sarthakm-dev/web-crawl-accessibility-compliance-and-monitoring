import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteService } from '../src/services/site.service';
import { Site } from '@packages/shared-models/site.model';
import { CrawlJob } from '@packages/shared-models/crawl-job.model';

vi.mock('@packages/shared-models/site.model', () => ({
  Site: {
    create: vi.fn(),
    findAndCountAll: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('@packages/shared-models/crawl-job.model', () => ({
  CrawlJob: {
    destroy: vi.fn(),
  },
}));

describe('SiteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a site', async () => {
    const mockSite = { id: 'site-1', name: 'Test' };

    (Site.create as any).mockResolvedValue(mockSite);

    const result = await SiteService.createSite('team-1', {
      name: 'Test',
      baseUrl: 'https://example.com',
    });

    expect(Site.create).toHaveBeenCalledWith({
      team_id: 'team-1',
      name: 'Test',
      base_url: 'https://example.com',
      is_active: true,
    });

    expect(result).toEqual(mockSite);
  });

  it('should return paginated sites', async () => {
    const mockRows = [{ id: '1' }, { id: '2' }];

    (Site.findAndCountAll as any).mockResolvedValue({
      rows: mockRows,
      count: 2,
    });

    const result = await SiteService.getAllSites({
      teamId: 'team-1',
      page: 1,
      limit: 5,
    });

    expect(Site.findAndCountAll).toHaveBeenCalled();
    expect(result.data).toEqual(mockRows);
    expect(result.pagination.totalPages).toBe(1);
  });

  it('should calculate correct offset for pagination', async () => {
    (Site.findAndCountAll as any).mockResolvedValue({
      rows: [],
      count: 0,
    });

    await SiteService.getAllSites({
      teamId: 'team-1',
      page: 3,
      limit: 10,
    });

    expect(Site.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: 20,
      })
    );
  });

  it('should apply search filter', async () => {
    (Site.findAndCountAll as any).mockResolvedValue({
      rows: [],
      count: 0,
    });

    await SiteService.getAllSites({
      teamId: 'team-1',
      page: 1,
      limit: 5,
      search: 'test',
    });

    expect(Site.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: expect.any(Object),
        }),
      })
    );
  });

  it('should apply status filter', async () => {
    (Site.findAndCountAll as any).mockResolvedValue({
      rows: [],
      count: 0,
    });

    await SiteService.getAllSites({
      teamId: 'team-1',
      page: 1,
      limit: 5,
      status: 'active',
    });

    expect(Site.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          is_active: true,
        }),
      })
    );
  });

  it('should return site by id', async () => {
    const mockSite = { id: 'site-1' };

    (Site.findOne as any).mockResolvedValue(mockSite);

    const result = await SiteService.getSiteById('team-1', 'site-1');

    expect(Site.findOne).toHaveBeenCalledWith({
      where: { id: 'site-1', team_id: 'team-1' },
    });

    expect(result).toEqual(mockSite);
  });

  it('should throw error if site not found', async () => {
    (Site.findOne as any).mockResolvedValue(null);

    await expect(SiteService.getSiteById('team-1', 'site-1')).rejects.toThrow(
      'Site not found'
    );
  });

  it('should hard delete site and related crawl jobs', async () => {
    const mockDestroy = vi.fn();

    const mockSite = {
      destroy: mockDestroy,
    };

    (Site.findOne as any).mockResolvedValue(mockSite);
    (CrawlJob.destroy as any).mockResolvedValue(undefined);

    await SiteService.deleteSite('team-1', 'site-1');

    expect(Site.findOne).toHaveBeenCalledWith({
      where: { id: 'site-1', team_id: 'team-1' },
    });

    expect(CrawlJob.destroy).toHaveBeenCalledWith({
      where: { site_id: 'site-1' },
    });

    expect(mockDestroy).toHaveBeenCalled();
  });

  it('should throw error if deleting non-existent site', async () => {
    (Site.findOne as any).mockResolvedValue(null);

    await expect(SiteService.deleteSite('team-1', 'site-1')).rejects.toThrow(
      'Site not found'
    );
  });
});
