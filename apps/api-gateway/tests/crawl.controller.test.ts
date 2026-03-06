import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlController } from '../src/controllers/crawl.controller';
import { proxyServiceRequest } from '../src/utils/service-proxy';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
  crawlParamsSchema,
} from '@packages/shared-validation/crawl.schema';

vi.mock('../src/utils/service-proxy');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/crawl.schema', () => ({
  triggerCrawlSchema: { parse: vi.fn() },
  getCrawlsQuerySchema: { parse: vi.fn() },
  crawlParamsSchema: { parse: vi.fn() },
}));

const mockProxy = proxyServiceRequest as unknown as ReturnType<typeof vi.fn>;
const mockHandleError = handleError as unknown as ReturnType<typeof vi.fn>;

const mockReq = (body = {}, query = {}, params = {}) =>
  ({
    body,
    query,
    params,
  }) as any;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn();
  return res;
};

describe('CrawlController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const proxyResponse = {
    status: 200,
    data: { message: 'ok' },
    headers: { 'set-cookie': ['cookie'] },
  };

  it('startCrawl success', async () => {
    (triggerCrawlSchema.parse as any).mockReturnValue({ url: 'test' });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({ url: 'test' });
    const res = mockRes();

    await CrawlController.startCrawl(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', ['cookie']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('startCrawl error', async () => {
    (triggerCrawlSchema.parse as any).mockImplementation(() => {
      throw new Error('validation error');
    });

    const req = mockReq();
    const res = mockRes();

    await CrawlController.startCrawl(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('getAll success', async () => {
    (getCrawlsQuerySchema.parse as any).mockReturnValue({ page: 1 });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, { page: 1 });
    const res = mockRes();

    await CrawlController.getAll(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAll error', async () => {
    (getCrawlsQuerySchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await CrawlController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('getById success', async () => {
    (crawlParamsSchema.parse as any).mockReturnValue({ id: '123' });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, {}, { id: '123' });
    const res = mockRes();

    await CrawlController.getById(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getById error', async () => {
    (crawlParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await CrawlController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
