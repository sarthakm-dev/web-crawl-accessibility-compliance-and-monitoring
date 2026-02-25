import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteController } from '../src/controllers/site.controller';
import { SiteService } from '../src/services/site.service';
import {
  createSiteSchema,
  getSitesQuerySchema,
} from '@packages/shared-validation/site.schema';

vi.mock('../src/services/site.service');
vi.mock('@packages/shared-validation/site.schema');

describe('SiteController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {},
      query: {},
      params: {},
      teamId: 'team-1',
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should create site successfully', async () => {
    req.body = { name: 'Test Site', baseUrl: 'https://example.com' };

    (createSiteSchema.parse as any).mockReturnValue(req.body);

    (SiteService.createSite as any).mockResolvedValue({
      id: 'site-1',
      name: 'Test Site',
    });

    await SiteController.createSite(req, res);

    expect(createSiteSchema.parse).toHaveBeenCalledWith(req.body);
    expect(SiteService.createSite).toHaveBeenCalledWith('team-1', req.body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 'site-1',
      name: 'Test Site',
    });
  });

  it('should return 401 if teamId missing in createSite()', async () => {
    req.teamId = undefined;
    req.body = { name: 'Test Site', baseUrl: 'https://example.com' };

    (createSiteSchema.parse as any).mockReturnValue(req.body);

    await SiteController.createSite(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  it('should return 400 if validation fails in createSite()', async () => {
    (createSiteSchema.parse as any).mockImplementation(() => {
      throw new Error('Invalid input');
    });

    await SiteController.createSite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid input',
    });
  });

  it('should return paginated sites', async () => {
    req.query = { page: '1', limit: '10' };

    const parsedQuery = { page: 1, limit: 10 };

    (getSitesQuerySchema.parse as any).mockReturnValue(parsedQuery);

    (SiteService.getAllSites as any).mockResolvedValue({
      data: [],
      pagination: {},
    });

    await SiteController.getAll(req, res);

    expect(getSitesQuerySchema.parse).toHaveBeenCalledWith(req.query);

    expect(SiteService.getAllSites).toHaveBeenCalledWith({
      teamId: 'team-1',
      page: 1,
      limit: 10,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [],
      pagination: {},
    });
  });

  it('should return 400 if query validation fails in getAll()', async () => {
    (getSitesQuerySchema.parse as any).mockImplementation(() => {
      throw new Error('Invalid query');
    });

    await SiteController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid query',
    });
  });

  it('should return site by id', async () => {
    req.params.id = 'site-1';

    (SiteService.getSiteById as any).mockResolvedValue({
      id: 'site-1',
      name: 'Test Site',
    });

    await SiteController.getById(req, res);

    expect(SiteService.getSiteById).toHaveBeenCalledWith('team-1', 'site-1');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'site-1',
      name: 'Test Site',
    });
  });

  it('should return 404 if site not found', async () => {
    req.params.id = 'site-1';

    (SiteService.getSiteById as any).mockRejectedValue(
      new Error('Site not found')
    );

    await SiteController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Site not found',
    });
  });

  it('should return 400 for other errors in getById()', async () => {
    req.params.id = 'site-1';

    (SiteService.getSiteById as any).mockRejectedValue(
      new Error('Something else')
    );

    await SiteController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something else',
    });
  });
});
