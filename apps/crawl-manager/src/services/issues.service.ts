import { IssuesRepository } from '../repositories/issues.repository';

export const IssuesService = {
  async list(filters: any) {
    // find all issues based on filters
    return IssuesRepository.findAll(filters);
  },

  async get(id: string) {
    // find issue by id
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
    // update status history
    return IssuesRepository.updateStatusWithHistory(
      issueId,
      userId,
      newStatus,
      note
    );
  },

  async addNote(issueId: string, userId: string, note: string) {
    // add note to issue
    return IssuesRepository.createNote({
      issue_instance_id: issueId,
      user_id: userId,
      note,
      created_at: new Date(),
    });
  },
};
