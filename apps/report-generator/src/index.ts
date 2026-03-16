import { initModels } from '@packages/shared-models/init-models';
import { startReportWorker } from './consumer/report.consumer';
import { logger } from '@packages/shared-config/logger';
async function startWorker() {
  try {
    await initModels();
    await startReportWorker();
  } catch (error) {
    logger.error({ error }, 'Worker startup failed');
  }
}

startWorker();
