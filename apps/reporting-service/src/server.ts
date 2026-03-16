import express from 'express';
import cors from 'cors';
import reportsRoutes from './routes/reports.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { sequelize } from '@packages/shared-config/database';
import { initModels } from '@packages/shared-models/init-models';
import amqp from 'amqplib';
import { jsonValidation } from '@packages/shared-validation/json.validation';
import { consumeAnalysisIssues } from './consumer/analysis-completed.consumer';
import { env } from '@packages/shared-config/env';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(jsonValidation());
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);

export async function ensureBucketExists() {}
async function startConsumer() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);

  const channel = await connection.createChannel();

  channel.prefetch(10);

  await channel.assertQueue('analysis_issues', {
    durable: true,
  });

  channel.consume('analysis_issues', message => {
    if (message) {
      consumeAnalysisIssues(message, channel);
    }
  });

  console.log('Reporting Service consuming analysis_issues');
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await initModels();

    await startConsumer();

    const PORT = env.REPORTING_PORT || 4004;

    app.listen(PORT, () => {
      console.log(`Reporting service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start reporting service', error);
  }
}

startServer();
