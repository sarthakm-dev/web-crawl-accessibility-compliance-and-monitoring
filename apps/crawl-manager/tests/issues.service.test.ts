import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IssuesService } from '../src/services/issues.service';
import { IssuesRepository } from '../src/repositories/issues.repository';

vi.mock('../src/repositories/issues.repository');

const mockRepo = IssuesRepository as unknown as {
  findAll: any;
  findById: any;
  updateStatusWithHistory: any;
  createNote: any;
};

describe('IssuesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return issues list', async () => {
    const filters = { page: 1, limit: 10 };

    mockRepo.findAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    const result = await IssuesService.list(filters);

    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual({ rows: [], count: 0 });
  });

  it('should return issue if found', async () => {
    const issue = { id: '1' };

    mockRepo.findById.mockResolvedValue(issue);

    const result = await IssuesService.get('1');

    expect(mockRepo.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(issue);
  });

  it('should throw error if issue not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(IssuesService.get('1')).rejects.toThrow('Issue not found');
  });

  it('should update issue status with history', async () => {
    mockRepo.updateStatusWithHistory.mockResolvedValue({
      id: '1',
      current_status: 'resolved',
    });

    const result = await IssuesService.updateStatus(
      '1',
      'user1',
      'resolved',
      'fixed'
    );

    expect(mockRepo.updateStatusWithHistory).toHaveBeenCalledWith(
      '1',
      'user1',
      'resolved',
      'fixed'
    );

    expect(result).toEqual({
      id: '1',
      current_status: 'resolved',
    });
  });

  it('should create issue note', async () => {
    const noteResult = { id: 'note1' };

    mockRepo.createNote.mockResolvedValue(noteResult);

    const result = await IssuesService.addNote('issue1', 'user1', 'test note');

    expect(mockRepo.createNote).toHaveBeenCalledWith({
      issue_instance_id: 'issue1',
      user_id: 'user1',
      note: 'test note',
      created_at: expect.any(Date),
    });

    expect(result).toEqual(noteResult);
  });
});
