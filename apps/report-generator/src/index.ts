import { initModels } from '@packages/shared-models/init-models';
import { startReportWorker } from './consumer/report.consumer';
import dotenv from "dotenv";
dotenv.config();
async function startWorker() {
  try {
    await initModels();
    await startReportWorker();
  } catch (error) {
    console.error('Worker startup failed:', error);
  }
}

startWorker();
