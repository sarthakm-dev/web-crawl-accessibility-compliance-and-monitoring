import { IssuesRepository } from '../repositories/issues.repository';

export const IssuesService = {
  async list(filters: any) {
    return IssuesRepository.findAll(filters);
  },

  async get(id: string) {
    const issue = await IssuesRepository.findById(id);
    if (!issue) throw new Error('Issue not found');
    return issue;
  },

  async updateStatus(
    issueId: string,
    userId: string,
    newStatus: string,
    note?: string
  ) {
    return IssuesRepository.updateStatusWithHistory(
      issueId,
      userId,
      newStatus,
      note
    );
  },

  async addNote(issueId: string, userId: string, note: string) {
    return IssuesRepository.createNote({
      issue_instance_id: issueId,
      user_id: userId,
      note,
      created_at: new Date(),
    });
  },
};
