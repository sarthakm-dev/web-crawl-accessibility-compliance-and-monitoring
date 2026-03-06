import { startAnalysisConsumer } from './consumers/analysis.consumer';
import { initModels } from '@packages/shared-models/init-models';
async function analyze() {
  try {
    initModels();
    await startAnalysisConsumer();
    console.log('Analysis worker started successfully');
  } catch (err) {
    console.error('Failed to start analysis worker:', err);
    process.exit(1);
  }
}

analyze();
