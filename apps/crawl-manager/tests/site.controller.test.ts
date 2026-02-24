import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SiteController } from '../src/controllers/site.controller';
import { Site } from '../src/models/site.model';

vi.mock('../src/models/site.model');

const app = express();
app.use(express.json());
app.post('/sites', SiteController.createSite);

describe('SiteController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create site successfully', async () => {
    (Site.create as any).mockResolvedValue({
      id: 'site-1',
      name: 'Example',
    });

    const res = await request(app).post('/sites').send({
      teamId: 'team-1',
      name: 'Example',
      baseUrl: 'https://example.com',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Example');
  });

  it('should return 400 if required fields missing', async () => {
    const res = await request(app).post('/sites').send({
      name: 'Missing',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('teamId, name and baseUrl are required');
  });

  it('should return 500 if DB fails', async () => {
    (Site.create as any).mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/sites').send({
      teamId: 'team-1',
      name: 'Example',
      baseUrl: 'https://example.com',
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB error');
  });
});
