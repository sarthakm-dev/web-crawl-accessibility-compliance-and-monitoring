import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteController } from '../src/controllers/site.controller';
import { proxyServiceRequest } from '../src/utils/service-proxy';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  bulkDeleteSitesSchema,
  createSiteSchema,
  getSitesQuerySchema,
  siteParamsSchema,
} from '@packages/shared-validation/site.schema';

vi.mock('../src/utils/service-proxy');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/site.schema', () => ({
  createSiteSchema: { parse: vi.fn() },
  getSitesQuerySchema: { parse: vi.fn() },
  siteParamsSchema: { parse: vi.fn() },
  bulkDeleteSitesSchema: { parse: vi.fn() },
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

describe('SiteController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const proxyResponse = {
    status: 200,
    data: { success: true },
    headers: { 'set-cookie': ['cookie'] },
  };

  it('createSite success', async () => {
    (createSiteSchema.parse as any).mockReturnValue({ name: 'test' });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({ name: 'test' });
    const res = mockRes();

    await SiteController.createSite(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', ['cookie']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('createSite validation error', async () => {
    (createSiteSchema.parse as any).mockImplementation(() => {
      throw new Error('validation');
    });

    const req = mockReq();
    const res = mockRes();

    await SiteController.createSite(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('getAll success', async () => {
    (getSitesQuerySchema.parse as any).mockReturnValue({ page: 1 });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, { page: 1 });
    const res = mockRes();

    await SiteController.getAll(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAll error', async () => {
    (getSitesQuerySchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await SiteController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('getById success', async () => {
    (siteParamsSchema.parse as any).mockReturnValue({ id: '123' });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, {}, { id: '123' });
    const res = mockRes();

    await SiteController.getById(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getById error', async () => {
    (siteParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await SiteController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('deleteSite success', async () => {
    (siteParamsSchema.parse as any).mockReturnValue({ id: '123' });
    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, {}, { id: '123' });
    const res = mockRes();

    await SiteController.deleteSite(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteSite error', async () => {
    (siteParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await SiteController.deleteSite(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('bulkDelete success', async () => {
    (bulkDeleteSitesSchema.parse as any).mockReturnValue({
      ids: ['1', '2'],
    });

    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({ ids: ['1', '2'] });
    const res = mockRes();

    await SiteController.bulkDelete(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', ['cookie']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
  it('bulkDelete validation error', async () => {
    (bulkDeleteSitesSchema.parse as any).mockImplementation(() => {
      throw new Error('validation');
    });

    const req = mockReq();
    const res = mockRes();

    await SiteController.bulkDelete(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
