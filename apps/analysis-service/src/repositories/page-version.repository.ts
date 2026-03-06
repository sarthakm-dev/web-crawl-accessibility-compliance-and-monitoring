import { PageVersion } from '@packages/shared-models/page-version.model';

export const PageVersionRepository = {
  async findById(id: string) {
    return PageVersion.findByPk(id);
  },

  async updateStatus(
    id: string,
    status: 'pending' | 'completed' | 'failed',
    completedAt?: Date,
    transaction?: any
  ) {
    return PageVersion.update(
      {
        analysis_status: status,
        ...(completedAt && { analysis_completed_at: completedAt }),
      },
      {
        where: { id },
        transaction,
      }
    );
  },
};
