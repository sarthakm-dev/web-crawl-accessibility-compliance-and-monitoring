import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json';
import authRoutes from './routes/auth.routes';
import siteRoutes from './routes/sites.routes';
import crawlRoutes from './routes/crawl.routes';
import issuesRoutes from './routes/issues.routes';
import dashboardRoutes from './routes/dashboard.routes';
import reportsRoutes from './routes/reports.routes';
import { logger as log } from '@packages/shared-config/logger';
import logger from 'morgan';
import cors from 'cors';
import { env } from '@packages/shared-config/env';

const app = express();
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(logger('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/crawl', crawlRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});
const PORT = env.GATEWAY_PORT || 4000;
app.listen(PORT, () => {
  log.info(`API Gateway Running on port ${PORT}`);
});
export default app;
