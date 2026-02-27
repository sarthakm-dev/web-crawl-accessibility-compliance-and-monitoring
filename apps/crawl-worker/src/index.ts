import amqp from 'amqplib';
import { CrawlService } from './services/crawl.service';
import { sequelize } from '@packages/shared-config/database';

async function startWorker() {
  try {
    await sequelize.sync();
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    await channel.assertQueue('crawl_jobs', { durable: true });

    console.log('Crawl Worker is listening for jobs...');

    channel.consume(
      'crawl_jobs',
      async msg => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());

        console.log('Received job:', payload.jobId);

        try {
          await CrawlService.processJob(payload);
          channel.ack(msg);
          console.log('Job Completed');
        } catch (error) {
          console.error('Job failed:', error);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('Worker startup failed:', error);
  }
}

startWorker();
