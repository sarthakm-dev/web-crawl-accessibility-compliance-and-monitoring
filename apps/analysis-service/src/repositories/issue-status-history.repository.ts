import { IssueStatusHistory } from '@packages/shared-models/issue-status-history.model';

export const IssueStatusHistoryRepository = {
  async create(data: any, transaction: any) {
    return IssueStatusHistory.create(data, { transaction });
  },
};
