import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteController } from '../src/controllers/site.controller';
import { SiteService } from '../src/services/site.service';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  bulkDeleteSitesSchema,
  createSiteSchema,
  getSitesQuerySchema,
  siteParamsSchema,
} from '@packages/shared-validation/site.schema';

vi.mock('../src/services/site.service');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/site.schema', () => ({
  createSiteSchema: { parse: vi.fn() },
  getSitesQuerySchema: { parse: vi.fn() },
  siteParamsSchema: { parse: vi.fn() },
  bulkDeleteSitesSchema: { parse: vi.fn() },
}));

const mockService = SiteService as unknown as {
  createSite: any;
  getAllSites: any;
  getSiteById: any;
  deleteSite: any;
  bulkDeleteSites: any;
};

const mockHandleError = handleError as unknown as ReturnType<typeof vi.fn>;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('SiteController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if teamId missing', async () => {
    const req: any = { body: {} };
    const res = mockRes();

    await SiteController.createSite(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should create site successfully', async () => {
    const req: any = {
      teamId: 'team1',
      body: { name: 'test', baseUrl: 'https://example.com' },
    };

    const res = mockRes();

    (createSiteSchema.parse as any).mockReturnValue({
      name: 'test',
      baseUrl: 'https://example.com',
      scheduledCrawlTime: '08:15',
    });

    mockService.createSite.mockResolvedValue({ id: 'site1' });

    await SiteController.createSite(req, res);

    expect(mockService.createSite).toHaveBeenCalledWith('team1', {
      name: 'test',
      baseUrl: 'https://example.com',
      scheduledCrawlTime: '08:15',
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should handle error in createSite', async () => {
    const req: any = { teamId: 'team1', body: {} };
    const res = mockRes();

    (createSiteSchema.parse as any).mockImplementation(() => {
      throw new Error('error');
    });

    await SiteController.createSite(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return 401 if teamId missing in getAll', async () => {
    const req: any = { query: {} };
    const res = mockRes();

    await SiteController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should fetch sites', async () => {
    const req: any = {
      teamId: 'team1',
      query: {},
    };

    const res = mockRes();

    (getSitesQuerySchema.parse as any).mockReturnValue({});

    mockService.getAllSites.mockResolvedValue({ rows: [], count: 0 });

    await SiteController.getAll(req, res);

    expect(mockService.getAllSites).toHaveBeenCalledWith({
      teamId: 'team1',
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in getAll', async () => {
    const req: any = { teamId: 'team1', query: {} };
    const res = mockRes();

    (getSitesQuerySchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await SiteController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return 401 if teamId missing in getById', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    await SiteController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return site by id', async () => {
    const req: any = {
      teamId: 'team1',
      params: { id: '1' },
    };

    const res = mockRes();

    (siteParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.getSiteById.mockResolvedValue({ id: '1' });

    await SiteController.getById(req, res);

    expect(mockService.getSiteById).toHaveBeenCalledWith('team1', '1');

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in getById', async () => {
    const req: any = {
      teamId: 'team1',
      params: { id: '1' },
    };

    const res = mockRes();

    (siteParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await SiteController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return 401 if teamId missing in deleteSite', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    await SiteController.deleteSite(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should delete site', async () => {
    const req: any = {
      teamId: 'team1',
      params: { id: '1' },
    };

    const res = mockRes();

    (siteParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.deleteSite.mockResolvedValue(undefined);

    await SiteController.deleteSite(req, res);

    expect(mockService.deleteSite).toHaveBeenCalledWith('team1', '1');

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in deleteSite', async () => {
    const req: any = {
      teamId: 'team1',
      params: { id: '1' },
    };

    const res = mockRes();

    (siteParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await SiteController.deleteSite(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('should return 401 if teamId missing in bulkDeleteSites', async () => {
    const req: any = { body: { ids: ['1'] } };
    const res = mockRes();

    await SiteController.bulkDeleteSites(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('should bulk delete sites', async () => {
    const req: any = {
      teamId: 'team1',
      body: { ids: ['1', '2'] },
    };

    const res = mockRes();

    (bulkDeleteSitesSchema.parse as any).mockReturnValue({
      ids: ['1', '2'],
    });

    mockService.bulkDeleteSites.mockResolvedValue(undefined);

    await SiteController.bulkDeleteSites(req, res);

    expect(mockService.bulkDeleteSites).toHaveBeenCalledWith('team1', [
      '1',
      '2',
    ]);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('should handle validation error in bulkDeleteSites', async () => {
    const req: any = {
      teamId: 'team1',
      body: {},
    };

    const res = mockRes();

    (bulkDeleteSitesSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await SiteController.bulkDeleteSites(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('should handle service error in bulkDeleteSites', async () => {
    const req: any = {
      teamId: 'team1',
      body: { ids: ['1'] },
    };

    const res = mockRes();

    (bulkDeleteSitesSchema.parse as any).mockReturnValue({
      ids: ['1'],
    });

    mockService.bulkDeleteSites.mockRejectedValue(new Error());

    await SiteController.bulkDeleteSites(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
