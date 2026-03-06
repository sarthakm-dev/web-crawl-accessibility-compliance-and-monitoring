import { IssueInstance } from '@packages/shared-models/issue-instance.model';

export const IssueInstanceRepository = {
  async create(data: any, transaction: any) {
    return IssueInstance.create(data, { transaction });
  },
};
