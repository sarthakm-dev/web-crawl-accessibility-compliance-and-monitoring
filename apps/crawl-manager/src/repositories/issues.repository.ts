import { IssueInstance } from '@packages/shared-models/issue-instance.model';
import { IssueDefinition } from '@packages/shared-models/issue-definition.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { Page } from '@packages/shared-models/page.model';
import { Site } from '@packages/shared-models/site.model';
import { IssueNote } from '@packages/shared-models/issue-note.model';
import { IssueStatusHistory } from '@packages/shared-models/issue-status-history.model';
import { User } from '@packages/shared-models/user.model';
import { Op } from 'sequelize';

export const IssuesRepository = {
  async findAll(filters: any) {
    const { page, limit, teamId, status, severity, search } = filters;

    return IssueInstance.findAndCountAll({
      include: [
        {
          model: IssueDefinition,
          where: severity ? { severity } : undefined,
        },
        {
          model: PageVersion,
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
        ...(status && { current_status: status }),
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
    return IssueInstance.findByPk(id, {
      include: [
        IssueDefinition,
        {
          model: IssueStatusHistory,
          include: [User],
        },
        {
          model: IssueNote,
          include: [User],
        },
      ],
    });
  },

  async updateStatus(id: string, status: string) {
    return IssueInstance.update({ current_status: status }, { where: { id } });
  },

  async createNote(data: any) {
    return IssueNote.create(data);
  },
};
