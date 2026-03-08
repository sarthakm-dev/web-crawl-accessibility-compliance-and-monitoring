import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlController } from '../src/controllers/crawl.controllers';
import { CrawlService } from '../src/services/crawl.service';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
  crawlParamsSchema,
  bulkDeleteCrawlsSchema,
} from '@packages/shared-validation/crawl.schema';

vi.mock('../src/services/crawl.service');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/crawl.schema', () => ({
  triggerCrawlSchema: { parse: vi.fn() },
  getCrawlsQuerySchema: { parse: vi.fn() },
  crawlParamsSchema: { parse: vi.fn() },
  bulkDeleteCrawlsSchema: { parse: vi.fn() },
}));

const mockService = CrawlService as unknown as {
  triggerCrawl: any;
  getCrawlById: any;
  getAllCrawls: any;
  bulkDeleteCrawls: any;
};

const mockHandleError = handleError as unknown as ReturnType<typeof vi.fn>;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('CrawlController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if userId missing', async () => {
    const req: any = { body: {} };
    const res = mockRes();

    (triggerCrawlSchema.parse as any).mockReturnValue({
      siteId: 'site1',
      triggerType: 'manual',
    });

    await CrawlController.trigger(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should trigger crawl successfully', async () => {
    const req: any = {
      userId: 'user1',
      body: {},
    };

    const res = mockRes();

    (triggerCrawlSchema.parse as any).mockReturnValue({
      siteId: 'site1',
      triggerType: 'manual',
    });

    mockService.triggerCrawl.mockResolvedValue({ id: 'job1' });

    await CrawlController.trigger(req, res);

    expect(mockService.triggerCrawl).toHaveBeenCalledWith(
      'site1',
      'user1',
      'manual'
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should handle error in trigger', async () => {
    const req: any = { body: {} };
    const res = mockRes();

    (triggerCrawlSchema.parse as any).mockImplementation(() => {
      throw new Error('validation error');
    });

    await CrawlController.trigger(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return crawl by id', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    (crawlParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.getCrawlById.mockResolvedValue({ id: '1' });

    await CrawlController.getById(req, res);

    expect(mockService.getCrawlById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 if crawl not found', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    (crawlParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.getCrawlById.mockRejectedValue(
      new Error('Crawl job not found')
    );

    await CrawlController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should handle unknown error in getById', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    (crawlParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.getCrawlById.mockRejectedValue(new Error('DB error'));

    await CrawlController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return all crawls', async () => {
    const req: any = { query: {} };
    const res = mockRes();

    (getCrawlsQuerySchema.parse as any).mockReturnValue({
      page: 1,
      limit: 10,
    });

    mockService.getAllCrawls.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await CrawlController.getAll(req, res);

    expect(mockService.getAllCrawls).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in getAll', async () => {
    const req: any = { query: {} };
    const res = mockRes();

    (getCrawlsQuerySchema.parse as any).mockImplementation(() => {
      throw new Error('validation error');
    });

    await CrawlController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('should return 401 if userId missing in bulkDelete', async () => {
    const req: any = { body: { ids: ['1'] } };
    const res = mockRes();

    await CrawlController.bulkDelete(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('should bulk delete crawls', async () => {
    const req: any = {
      userId: 'user1',
      body: { ids: ['1', '2'] },
    };

    const res = mockRes();

    (bulkDeleteCrawlsSchema.parse as any).mockReturnValue({
      ids: ['1', '2'],
    });

    mockService.bulkDeleteCrawls.mockResolvedValue(undefined);

    await CrawlController.bulkDelete(req, res);

    expect(mockService.bulkDeleteCrawls).toHaveBeenCalledWith(['1', '2']);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('should handle validation error in bulkDelete', async () => {
    const req: any = {
      userId: 'user1',
      body: {},
    };

    const res = mockRes();

    (bulkDeleteCrawlsSchema.parse as any).mockImplementation(() => {
      throw new Error('validation error');
    });

    await CrawlController.bulkDelete(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('should handle service error in bulkDelete', async () => {
    const req: any = {
      userId: 'user1',
      body: { ids: ['1'] },
    };

    const res = mockRes();

    (bulkDeleteCrawlsSchema.parse as any).mockReturnValue({
      ids: ['1'],
    });

    mockService.bulkDeleteCrawls.mockRejectedValue(new Error('DB error'));

    await CrawlController.bulkDelete(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
