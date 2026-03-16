import { startAnalysisConsumer } from './consumers/analysis.consumer';
import { initModels } from '@packages/shared-models/init-models';
import { logger } from '@packages/shared-config/logger';
async function analyze() {
  try {
    initModels();
    await startAnalysisConsumer();
    logger.info('Analysis worker started successfully');
  } catch (err) {
    logger.error({ err }, 'Failed to start analysis worker:');
    process.exit(1);
  }
}

analyze();
