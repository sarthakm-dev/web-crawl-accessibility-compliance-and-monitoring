import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IssuesController } from '../src/controllers/issues.controller';
import { IssuesService } from '../src/services/issues.service';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  issuesQuerySchema,
  issueParamsSchema,
  updateIssueStatusSchema,
  addNoteSchema,
} from '@packages/shared-validation/issue.schema';

vi.mock('../src/services/issues.service');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/issue.schema', () => ({
  issuesQuerySchema: { parse: vi.fn() },
  issueParamsSchema: { parse: vi.fn() },
  updateIssueStatusSchema: { parse: vi.fn() },
  addNoteSchema: { parse: vi.fn() },
}));

const mockService = IssuesService as unknown as {
  list: any;
  get: any;
  updateStatus: any;
  addNote: any;
};

const mockHandleError = handleError as unknown as ReturnType<typeof vi.fn>;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('IssuesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if teamId missing', async () => {
    const req: any = { query: {} };
    const res = mockRes();

    await IssuesController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return issues list', async () => {
    const req: any = {
      teamId: 'team1',
      query: {},
    };

    const res = mockRes();

    (issuesQuerySchema.parse as any).mockReturnValue({});

    mockService.list.mockResolvedValue({ rows: [] });

    await IssuesController.getAll(req, res);

    expect(mockService.list).toHaveBeenCalledWith({
      teamId: 'team1',
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in getAll', async () => {
    const req: any = {
      teamId: 'team1',
      query: {},
    };

    const res = mockRes();

    (issuesQuerySchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await IssuesController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return issue by id', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    (issueParamsSchema.parse as any).mockReturnValue({ id: '1' });

    mockService.get.mockResolvedValue({ id: '1' });

    await IssuesController.getById(req, res);

    expect(mockService.get).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in getById', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();

    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await IssuesController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return 401 if userId missing', async () => {
    const req: any = { params: { id: '1' }, body: {} };
    const res = mockRes();

    await IssuesController.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should update issue status', async () => {
    const req: any = {
      userId: 'user1',
      params: { id: '1' },
      body: {},
    };

    const res = mockRes();

    (issueParamsSchema.parse as any).mockReturnValue({ id: '1' });
    (updateIssueStatusSchema.parse as any).mockReturnValue({
      status: 'resolved',
      note: 'fixed',
    });

    mockService.updateStatus.mockResolvedValue({ id: '1' });

    await IssuesController.updateStatus(req, res);

    expect(mockService.updateStatus).toHaveBeenCalledWith(
      '1',
      'user1',
      'resolved',
      'fixed'
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in updateStatus', async () => {
    const req: any = {
      userId: 'user1',
      params: { id: '1' },
      body: {},
    };

    const res = mockRes();

    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await IssuesController.updateStatus(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('should return 401 if userId missing', async () => {
    const req: any = { params: { id: '1' }, body: {} };
    const res = mockRes();

    await IssuesController.addNote(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should add note successfully', async () => {
    const req: any = {
      userId: 'user1',
      params: { id: '1' },
      body: {},
    };

    const res = mockRes();

    (issueParamsSchema.parse as any).mockReturnValue({ id: '1' });
    (addNoteSchema.parse as any).mockReturnValue({
      note: 'test note',
    });

    mockService.addNote.mockResolvedValue({ id: 'note1' });

    await IssuesController.addNote(req, res);

    expect(mockService.addNote).toHaveBeenCalledWith('1', 'user1', 'test note');

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle error in addNote', async () => {
    const req: any = {
      userId: 'user1',
      params: { id: '1' },
      body: {},
    };

    const res = mockRes();

    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    await IssuesController.addNote(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
