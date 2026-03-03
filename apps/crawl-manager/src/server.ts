import { initModels } from '@packages/shared-models/init-models';
import { initPublisher } from './publishers/crawl.publishers';
import crawlRoutes from './routes/crawl.routes';
import siteRoutes from './routes/site.routes';
import issueRoutes from './routes/issues.routes';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { jsonValidation } from '@packages/shared-validation/json.validation';
dotenv.config();

async function crawlManager() {
  initModels();
  await initPublisher();
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(jsonValidation());
  app.use('/api/sites', siteRoutes);
  app.use('/api/crawl', crawlRoutes);
  app.use('/api/issues', issueRoutes);
  app.listen(3002, () => {
    console.log(`Crawl Manager running on port 3002`);
  });
}
crawlManager();
