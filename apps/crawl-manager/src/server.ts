import { initModels } from '@packages/shared-models/init-models';
import { initPublisher } from './publishers/crawl.publishers';
import crawlRoutes from './routes/crawl.routes';
import siteRoutes from './routes/site.routes';
import issueRoutes from './routes/issues.routes';
import express from 'express';
import cookieParser from 'cookie-parser';
import { jsonValidation } from '@packages/shared-validation/json.validation';
import http from 'http';
import { initSocket } from './socket/server';
import { startCrawlEventsConsumer } from './consumers/crawl-events.consumer';
import { startAnalysisEventsConsumer } from './consumers/analysis.consumer';

async function crawlManager() {
  initModels();
  await initPublisher();
  const app = express();
  const server = http.createServer(app);
  initSocket(server);
  await startCrawlEventsConsumer();
  await startAnalysisEventsConsumer();
  app.use(express.json());
  app.use(cookieParser());
  app.use(jsonValidation());
  app.use('/api/sites', siteRoutes);
  app.use('/api/crawl', crawlRoutes);
  app.use('/api/issues', issueRoutes);
  server.listen(3002, () => {
    console.log(`Crawl Manager running on port 3002`);
  });
}
crawlManager();
