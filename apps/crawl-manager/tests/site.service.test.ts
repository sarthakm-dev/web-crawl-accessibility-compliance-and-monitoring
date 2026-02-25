import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteService } from '../src/services/site.service';
import { Site } from '../src/models/site.model';

vi.mock('../src/models/site.model');

describe('SiteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a site', async () => {
    const mockSite = {
      id: 'site-1',
      team_id: 'team-1',
      name: 'Test Site',
      base_url: 'https://example.com',
      is_active: true,
    };

    (Site.create as any).mockResolvedValue(mockSite);

    const result = await SiteService.createSite('team-1', {
      name: 'Test Site',
      baseUrl: 'https://example.com',
    });

    expect(Site.create).toHaveBeenCalledWith({
      team_id: 'team-1',
      name: 'Test Site',
      base_url: 'https://example.com',
      is_active: true,
    });

    expect(result).toEqual(mockSite);
  });

  it('should return paginated sites', async () => {
    const mockRows = [
      { id: 'site-1', name: 'Site 1' },
      { id: 'site-2', name: 'Site 2' },
    ];

    (Site.findAndCountAll as any).mockResolvedValue({
      rows: mockRows,
      count: 2,
    });

    const result = await SiteService.getAllSites({
      teamId: 'team-1',
      page: 1,
      limit: 10,
    });

    expect(Site.findAndCountAll).toHaveBeenCalledWith({
      where: { team_id: 'team-1' },
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: 0,
    });

    expect(result).toEqual({
      data: mockRows,
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
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

  it('should return site by id', async () => {
    const mockSite = {
      id: 'site-1',
      team_id: 'team-1',
      name: 'Test Site',
    };

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
});
