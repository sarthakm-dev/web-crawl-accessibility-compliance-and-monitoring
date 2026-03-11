import { Reports } from '@packages/shared-models/reports.model';

export const ReportsRepository = {
  async create(data: any) {
    return await Reports.create(data);
  },

  async update(reportId: string, data: any) {
    return Reports.update(data, {
      where: { id: reportId },
    });
  },

  async updateStatus(id: string, status: string) {
    return await Reports.update({ status }, { where: { id } });
  },

  async markCompleted(
    id: string,
    bucket: string,
    objectKey: string,
    fileSize?: number
  ) {
    return await Reports.update(
      {
        status: 'completed',
        bucket,
        object_key: objectKey,
        file_size: fileSize,
        generated_at: new Date(),
      },
      {
        where: { id },
      }
    );
  },

  async getById(id: string) {
    return await Reports.findByPk(id);
  },

  async getBySite(siteId: string) {
    return await Reports.findAll({
      where: { site_id: siteId },
      order: [['created_at', 'DESC']],
    });
  },
};
