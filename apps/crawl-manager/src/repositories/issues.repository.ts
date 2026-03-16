import { IssueInstance } from '@packages/shared-models/issue-instance.model';
import { IssueDefinition } from '@packages/shared-models/issue-definition.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { Page } from '@packages/shared-models/page.model';
import { Site } from '@packages/shared-models/site.model';
import { IssueNote } from '@packages/shared-models/issue-note.model';
import { IssueStatusHistory } from '@packages/shared-models/issue-status-history.model';
import { User } from '@packages/shared-models/user.model';
import { sequelize } from '@packages/shared-config/database';
import { Op } from 'sequelize';

export const IssuesRepository = {
  async findAll(filters: any) {
    const { page, limit, teamId, status, severity, search } = filters;
    // get all issues for specified filters
    return IssueInstance.findAndCountAll({
      include: [
        {
          model: IssueDefinition,
          where: severity ? { severity } : undefined,
        },
        {
          model: PageVersion,
          attributes: { exclude: ['html_content'] },
          include: [
            {
              model: Page,
              include: [
                {
                  model: Site,
                  where: { team_id: teamId },
                },
              ],
            },
          ],
        },
      ],
      where: {
        ...(status && status !== 'all' && { current_status: status }),
        ...(search && {
          message: { [Op.iLike]: `%${search}%` },
        }),
      },
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
  },

  async findById(id: string) {
    // find issue by id
    return IssueInstance.findByPk(id, {
      include: [
        IssueDefinition,
        {
          model: IssueStatusHistory,
          include: [User],
          separate: true,
          order: [['changed_at', 'ASC']],
        },
        {
          model: IssueNote,
          separate: true,
          order: [['created_at', 'DESC']],
          include: [User],
        },
      ],
    });
  },

  async updateStatus(id: string, status: string) {
    // updat status of issue
    return IssueInstance.update({ current_status: status }, { where: { id } });
  },

  async createNote(data: any) {
    // add note to issue
    return IssueNote.create(data);
  },
  async updateStatusWithHistory(
    issueId: string,
    userId: string,
    newStatus: string,
    note?: string
  ) {
    // start a transaction
    const transaction = await sequelize.transaction();

    try {
      // find the issue selected
      const issue = await IssueInstance.findByPk(issueId, { transaction });
      if (!issue) throw new Error('Issue not found');
      // GET PREVIOUS STATUS
      const previousStatus = issue.current_status;
      // UPDATE ISSUE STATUS
      await issue.update({ current_status: newStatus }, { transaction });
      // update issue status history
      await IssueStatusHistory.create(
        {
          issue_instance_id: issueId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: userId,
          changed_at: new Date(),
          note: note ?? null,
        },
        { transaction }
      );
      // commit transaction
      await transaction.commit();
      return issue;
    } catch (error) {
      // rollback transaction if failed
      await transaction.rollback();
      throw error;
    }
  },
};
