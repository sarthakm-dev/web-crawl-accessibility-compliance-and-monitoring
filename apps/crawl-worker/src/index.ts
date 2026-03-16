import amqp from 'amqplib';
import { env } from '@packages/shared-config/env';
import { CrawlService } from './services/crawl.service';
import { initModels } from '@packages/shared-models/init-models';
import { ensureBucket } from '@packages/shared-config/create-bucket';
import { logger } from '@packages/shared-config/logger';

async function startWorker() {
  try {
    // initialize db models
    initModels();
    // ensure s3 bucket exists
    await ensureBucket();
    const connection = await amqp.connect(env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    await channel.assertQueue('crawl_jobs', { durable: true });

    logger.info('Crawl Worker is listening for jobs...');
    // consume message to process jobs
    channel.consume(
      'crawl_jobs',
      async msg => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());

        logger.info('Received job:', payload.jobId);

        try {
          // crawl page using puppeteer
          await CrawlService.processJob(payload, channel);
          channel.ack(msg);
          logger.info('Job Completed');
        } catch (error) {
          logger.error({ error }, 'Job failed');
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    logger.error({ error }, 'Worker startup failed');
  }
}

startWorker();
