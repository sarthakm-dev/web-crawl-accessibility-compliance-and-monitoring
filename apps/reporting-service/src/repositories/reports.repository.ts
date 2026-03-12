import { Reports } from '@packages/shared-models/reports.model';

export const ReportsRepository = {
  async create(data: any) {
    return await Reports.create(data);
  }, 
};
