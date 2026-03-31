import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteService } from '../src/services/site.service';
import { SiteRepository } from '../src/repositories/site.repository';

vi.mock('../src/repositories/site.repository');

const mockRepo = SiteRepository as unknown as {
  create: any;
  findAllWithPagination: any;
  findById: any;
  deleteWithJobs: any;
  bulkDelete: any;
};

describe('SiteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create site', async () => {
    mockRepo.create.mockResolvedValue({ id: 'site1' });

    const result = await SiteService.createSite('team1', {
      name: 'Test Site',
      baseUrl: 'https://example.com',
      scheduledCrawlTime: '09:30',
    });

    expect(mockRepo.create).toHaveBeenCalledWith(
      'team1',
      'Test Site',
      'https://example.com',
      '09:30'
    );

    expect(result).toEqual({ id: 'site1' });
  });

  it('should return paginated sites', async () => {
    mockRepo.findAllWithPagination.mockResolvedValue({
      rows: [{ id: 'site1' }],
      count: 10,
    });

    const result = await SiteService.getAllSites({
      teamId: 'team1',
      page: 1,
      limit: 5,
    });

    expect(result).toEqual({
      data: [{ id: 'site1' }],
      pagination: {
        total: 10,
        page: 1,
        limit: 5,
        totalPages: 2,
      },
    });
  });

  it('should ensure totalPages is at least 1', async () => {
    mockRepo.findAllWithPagination.mockResolvedValue({
      rows: [],
      count: 0,
    });

    const result = await SiteService.getAllSites({
      teamId: 'team1',
      page: 1,
      limit: 10,
    });

    expect(result.pagination.totalPages).toBe(1);
  });

  it('should return site if found', async () => {
    const site = { id: 'site1' };

    mockRepo.findById.mockResolvedValue(site);

    const result = await SiteService.getSiteById('team1', 'site1');

    expect(mockRepo.findById).toHaveBeenCalledWith('team1', 'site1');
    expect(result).toEqual(site);
  });

  it('should throw if site not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(SiteService.getSiteById('team1', 'site1')).rejects.toThrow(
      'Site not found'
    );
  });

  it('should delete site when found', async () => {
    mockRepo.findById.mockResolvedValue({ id: 'site1' });
    mockRepo.deleteWithJobs.mockResolvedValue(undefined);

    await SiteService.deleteSite('team1', 'site1');

    expect(mockRepo.deleteWithJobs).toHaveBeenCalledWith('site1');
  });

  it('should throw error when deleting non-existent site', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(SiteService.deleteSite('team1', 'site1')).rejects.toThrow(
      'Site not found'
    );
  });

  it('should bulk delete sites', async () => {
    const ids = ['site1', 'site2'];

    mockRepo.bulkDelete.mockResolvedValue(2);

    await SiteService.bulkDeleteSites('team1', ids);

    expect(mockRepo.bulkDelete).toHaveBeenCalledWith('team1', ids);
  });
  it('should throw error when no sites deleted', async () => {
    const ids = ['site1', 'site2'];

    mockRepo.bulkDelete.mockResolvedValue(0);

    await expect(SiteService.bulkDeleteSites('team1', ids)).rejects.toThrow(
      'Sites not found'
    );
  });
});
