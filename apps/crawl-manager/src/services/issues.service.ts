import { IssuesRepository } from '../repositories/issues.repository';
import { sequelize } from '@packages/shared-config/database';
import { IssueStatusHistory } from '@packages/shared-models/issue-status-history.model';

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
    const transaction = await sequelize.transaction();

    try {
      const issue = await IssuesRepository.findById(issueId);
      if (!issue) throw new Error('Issue not found');

      const previousStatus = issue.current_status;

      await issue.update({ current_status: newStatus }, { transaction });

      await IssueStatusHistory.create(
        {
          issue_instance_id: issueId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: userId,
          changed_at: new Date(),
          note: note || null,
        },
        { transaction }
      );

      await transaction.commit();
      return { message: 'Status updated' };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
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
