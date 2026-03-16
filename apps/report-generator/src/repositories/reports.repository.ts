import { Reports } from '@packages/shared-models/reports.model';

export const ReportsRepository = {
  async update(reportId: string, data: any) {
    // update reports table data
    return Reports.update(data, {
      where: { id: reportId },
    });
  },

  async getById(id: string) {
    // gete report data based on id
    return await Reports.findByPk(id);
  },
};
