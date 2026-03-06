import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IssuesController } from '../src/controllers/issues.controller';
import { proxyServiceRequest } from '../src/utils/service-proxy';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  issuesQuerySchema,
  issueParamsSchema,
  updateIssueStatusSchema,
  addNoteSchema,
} from '@packages/shared-validation/issue.schema';

vi.mock('../src/utils/service-proxy');
vi.mock('@packages/shared-utils/error-handler');

vi.mock('@packages/shared-validation/issue.schema', () => ({
  issuesQuerySchema: { parse: vi.fn() },
  issueParamsSchema: { parse: vi.fn() },
  updateIssueStatusSchema: { parse: vi.fn() },
  addNoteSchema: { parse: vi.fn() },
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

describe('IssuesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const proxyResponse = {
    status: 200,
    data: { success: true },
    headers: { 'set-cookie': ['cookie'] },
  };

  it('getAll success', async () => {
    (issuesQuerySchema.parse as any).mockReturnValue({ page: 1 });

    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, { page: 1 });
    const res = mockRes();

    await IssuesController.getAll(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', ['cookie']);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAll error', async () => {
    (issuesQuerySchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await IssuesController.getAll(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('getById success', async () => {
    (issueParamsSchema.parse as any).mockReturnValue({ id: '123' });

    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({}, {}, { id: '123' });
    const res = mockRes();

    await IssuesController.getById(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getById error', async () => {
    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await IssuesController.getById(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('updateStatus success', async () => {
    (issueParamsSchema.parse as any).mockReturnValue({ id: '123' });
    (updateIssueStatusSchema.parse as any).mockReturnValue({ status: 'open' });

    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({ status: 'open' }, {}, { id: '123' });
    const res = mockRes();

    await IssuesController.updateStatus(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updateStatus error', async () => {
    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await IssuesController.updateStatus(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('addNote success', async () => {
    (issueParamsSchema.parse as any).mockReturnValue({ id: '123' });
    (addNoteSchema.parse as any).mockReturnValue({ note: 'test' });

    mockProxy.mockResolvedValue(proxyResponse);

    const req = mockReq({ note: 'test' }, {}, { id: '123' });
    const res = mockRes();

    await IssuesController.addNote(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('addNote error', async () => {
    (issueParamsSchema.parse as any).mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await IssuesController.addNote(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });
});
