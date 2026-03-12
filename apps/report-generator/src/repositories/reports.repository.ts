import { Reports } from '@packages/shared-models/reports.model';

export const ReportsRepository = {
 

  async update(reportId: string, data: any) {
    return Reports.update(data, {
      where: { id: reportId },
    });
  },

  

  async getById(id: string) {
    return await Reports.findByPk(id);
  },

};
