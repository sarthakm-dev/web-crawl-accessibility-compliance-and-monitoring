import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlController } from '../src/controllers/crawl.controller';
import axios from 'axios';
import { Request, Response } from 'express';

vi.mock('axios');

describe('CrawlController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: any;
  let jsonMock: any;
  let setHeaderMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    statusMock = vi.fn().mockReturnThis();
    jsonMock = vi.fn().mockReturnThis();
    setHeaderMock = vi.fn();

    mockReq = {
      body: { siteId: 'site-1' },
      headers: { cookie: 'accessToken=abc' },
      params: { id: 'crawl-1' },
      query: { page: '1' },
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
    };
  });

  it('should forward startCrawl request and return response', async () => {
    (axios.post as any).mockResolvedValue({
      status: 201,
      data: { id: 'crawl-1' },
      headers: {
        'set-cookie': ['refreshToken=xyz'],
      },
    });

    await CrawlController.startCrawl(mockReq as Request, mockRes as Response);

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.CRAWL_MANAGER_URL}/crawl`,
      mockReq.body,
      expect.objectContaining({
        headers: { Cookie: 'accessToken=abc' },
        withCredentials: true,
      })
    );

    expect(setHeaderMock).toHaveBeenCalledWith('set-cookie', [
      'refreshToken=xyz',
    ]);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ id: 'crawl-1' });
  });

  it('should handle startCrawl error properly', async () => {
    (axios.post as any).mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'Invalid request' },
      },
    });

    await CrawlController.startCrawl(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid request',
    });
  });

  it('should fetch all crawls successfully', async () => {
    (axios.get as any).mockResolvedValue({
      status: 200,
      data: { data: [] },
    });

    await CrawlController.getAll(mockReq as Request, mockRes as Response);

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.CRAWL_MANAGER_URL}/crawl`,
      expect.objectContaining({
        headers: { Cookie: 'accessToken=abc' },
        params: mockReq.query,
        withCredentials: true,
      })
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ data: [] });
  });

  it('should handle getAll error', async () => {
    (axios.get as any).mockRejectedValue({
      response: {
        status: 500,
        data: { error: 'Server error' },
      },
    });

    await CrawlController.getAll(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Server error',
    });
  });

  it('should fetch crawl by id successfully', async () => {
    (axios.get as any).mockResolvedValue({
      status: 200,
      data: { id: 'crawl-1' },
    });

    await CrawlController.getById(mockReq as Request, mockRes as Response);

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.CRAWL_MANAGER_URL}/crawl/crawl-1`,
      expect.objectContaining({
        headers: { Cookie: 'accessToken=abc' },
        withCredentials: true,
      })
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ id: 'crawl-1' });
  });

  it('should handle getById error', async () => {
    (axios.get as any).mockRejectedValue({
      response: {
        status: 404,
        data: { error: 'Not found' },
      },
    });

    await CrawlController.getById(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Not found',
    });
  });

  it('should handle startCrawl without set-cookie header', async () => {
    (axios.post as any).mockResolvedValue({
      status: 201,
      data: { id: 'crawl-1' },
      headers: {},
    });

    await CrawlController.startCrawl(mockReq as Request, mockRes as Response);

    expect(setHeaderMock).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(201);
  });

  it('should handle startCrawl network error', async () => {
    (axios.post as any).mockRejectedValue(new Error('Network down'));

    await CrawlController.startCrawl(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Crawl Creation Failed',
    });
  });

  it('should handle getAll network error', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network down'));

    await CrawlController.getAll(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Failed to fetch crawls',
    });
  });

  it('should handle getById network error', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network down'));

    await CrawlController.getById(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Failed to fetch crawl',
    });
  });
});
