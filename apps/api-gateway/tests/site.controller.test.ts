import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteController } from '../src/controllers/site.controller';
import axios from 'axios';
import { Request, Response } from 'express';

vi.mock('axios');

describe('SiteController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: any;
  let jsonMock: any;
  let setHeaderMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.CRAWL_MANAGER_URL = 'http://localhost:3002';

    statusMock = vi.fn().mockReturnThis();
    jsonMock = vi.fn().mockReturnThis();
    setHeaderMock = vi.fn();

    mockReq = {
      body: { name: 'Test Site' },
      headers: { cookie: 'accessToken=abc' },
      params: { id: 'site-1' },
      query: { page: '1' },
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
    };
  });

  it('should create site successfully with set-cookie', async () => {
    (axios.post as any).mockResolvedValue({
      status: 201,
      data: { id: 'site-1' },
      headers: { 'set-cookie': ['refreshToken=xyz'] },
    });

    await SiteController.createSite(mockReq as Request, mockRes as Response);

    expect(setHeaderMock).toHaveBeenCalledWith('set-cookie', [
      'refreshToken=xyz',
    ]);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ id: 'site-1' });
  });

  it('should create site without set-cookie header', async () => {
    (axios.post as any).mockResolvedValue({
      status: 201,
      data: { id: 'site-1' },
      headers: {},
    });

    await SiteController.createSite(mockReq as Request, mockRes as Response);

    expect(setHeaderMock).not.toHaveBeenCalled();
  });

  it('should handle createSite error with response', async () => {
    (axios.post as any).mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'Invalid site' },
      },
    });

    await SiteController.createSite(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid site',
    });
  });

  it('should handle createSite network error', async () => {
    (axios.post as any).mockRejectedValue(new Error('Network down'));

    await SiteController.createSite(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Site Creation Failed',
    });
  });

  it('should fetch all sites successfully', async () => {
    (axios.get as any).mockResolvedValue({
      status: 200,
      data: { data: [] },
    });

    await SiteController.getAll(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ data: [] });
  });

  it('should handle getAll error without response', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network error'));

    await SiteController.getAll(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Failed to fetch sites',
    });
  });

  it('should fetch site by id successfully', async () => {
    (axios.get as any).mockResolvedValue({
      status: 200,
      data: { id: 'site-1' },
    });

    await SiteController.getById(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ id: 'site-1' });
  });

  it('should handle getById error with response', async () => {
    (axios.get as any).mockRejectedValue({
      response: {
        status: 404,
        data: { error: 'Not found' },
      },
    });

    await SiteController.getById(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Not found',
    });
  });

  it('should delete site successfully', async () => {
    (axios.delete as any).mockResolvedValue({
      status: 200,
      data: { message: 'Deleted' },
    });

    await SiteController.deleteSite(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Deleted' });
  });

  it('should handle deleteSite error with response', async () => {
    (axios.delete as any).mockRejectedValue({
      response: {
        status: 403,
        data: { error: 'Forbidden' },
      },
    });

    await SiteController.deleteSite(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Forbidden',
    });
  });

  it('should handle deleteSite error without response (fallback to message)', async () => {
    (axios.delete as any).mockRejectedValue(new Error('Network crash'));

    await SiteController.deleteSite(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Network crash',
    });
  });
});
