import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlController } from '../src/controllers/crawl.controllers';
import { CrawlService } from '../src/services/crawl.service';
import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
} from '@packages/shared-validation/crawl.schema';

vi.mock('../src/services/crawl.service');
vi.mock('@packages/shared-validation/crawl.schema');

describe('CrawlController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user-1',
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should trigger crawl successfully', async () => {
    req.body = {
      siteId: 'site-1',
      triggerType: 'manual',
    };

    (triggerCrawlSchema.parse as any).mockReturnValue(req.body);

    (CrawlService.triggerCrawl as any).mockResolvedValue({
      id: 'crawl-1',
    });

    await CrawlController.trigger(req, res);

    expect(triggerCrawlSchema.parse).toHaveBeenCalledWith(req.body);
    expect(CrawlService.triggerCrawl).toHaveBeenCalledWith(
      'site-1',
      'user-1',
      'manual'
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 'crawl-1' });
  });

  it('should return 401 if user not present in trigger()', async () => {
    req.userId = undefined;
    req.body = { siteId: 'site-1', triggerType: 'manual' };

    (triggerCrawlSchema.parse as any).mockReturnValue(req.body);

    await CrawlController.trigger(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 400 if schema validation fails in trigger()', async () => {
    (triggerCrawlSchema.parse as any).mockImplementation(() => {
      throw new Error('Invalid input');
    });

    await CrawlController.trigger(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
  });

  it('should return crawl by id', async () => {
    req.params.id = 'crawl-1';

    (CrawlService.getCrawlById as any).mockResolvedValue({
      id: 'crawl-1',
    });

    await CrawlController.getById(req, res);

    expect(CrawlService.getCrawlById).toHaveBeenCalledWith('crawl-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'crawl-1' });
  });

  it('should return 404 if crawl not found', async () => {
    req.params.id = 'crawl-1';

    (CrawlService.getCrawlById as any).mockRejectedValue(
      new Error('Crawl job not found')
    );

    await CrawlController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Crawl job not found',
    });
  });

  it('should return paginated crawls', async () => {
    req.query = { page: '1', limit: '10' };

    const parsedQuery = { page: 1, limit: 10 };

    (getCrawlsQuerySchema.parse as any).mockReturnValue(parsedQuery);

    (CrawlService.getAllCrawls as any).mockResolvedValue({
      data: [],
      pagination: {},
    });

    await CrawlController.getAll(req, res);

    expect(getCrawlsQuerySchema.parse).toHaveBeenCalledWith(req.query);
    expect(CrawlService.getAllCrawls).toHaveBeenCalledWith(parsedQuery);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [],
      pagination: {},
    });
  });

  it('should return 400 if query validation fails in getAll()', async () => {
    (getCrawlsQuerySchema.parse as any).mockImplementation(() => {
      throw new Error('Invalid query');
    });

    await CrawlController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid query',
    });
  });
  it('should return 400 if id is missing in deleteSite', async () => {
    const req = {
      params: {},
      teamId: 'team-1',
    } as any;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await CrawlController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Id is required',
    });
  });
});
