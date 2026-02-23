import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { CrawlController } from '../src/controllers/crawl.controllers';
import { CrawlService } from '../src/services/crawl.service';

vi.mock('../src/services/crawl.service');

const app = express();
app.use(express.json());

app.use((req: any, _res, next) => {
  req.user = { userId: 'user-1' };
  next();
});

app.post('/crawl', CrawlController.trigger);

describe('CrawlController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger crawl successfully', async () => {
    (CrawlService.triggerCrawl as any).mockResolvedValue({
      id: 'job-123',
    });

    const res = await request(app).post('/crawl').send({
      siteId: 'site-1',
      triggerType: 'manual',
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe('job-123');

    expect(CrawlService.triggerCrawl).toHaveBeenCalledWith(
      'site-1',
      'user-1',
      'manual'
    );
  });

  it('should return 400 if service throws', async () => {
    (CrawlService.triggerCrawl as any).mockRejectedValue(
      new Error('Site not found')
    );

    const res = await request(app).post('/crawl').send({
      siteId: 'bad',
      triggerType: 'manual',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Site not found');
  });
});
