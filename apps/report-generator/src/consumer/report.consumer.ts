import amqp from 'amqplib';
import { consumeReportJob } from '../workers/report.worker';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';
export async function startReportWorker() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);

  connection.on('connect', () => {
    logger.info('RabbitMQ connected for report generator');
  });

  connection.on('disconnect', err => {
    logger.error(err, 'RabbitMQ disconnected');
  });
  // create channel
  const channel = await connection.createChannel();
  // assert report_generation queue
  await channel.assertQueue('report_generation', {
    durable: true,
  });

  channel.prefetch(5);
  // consume jobs in report generation queue
  channel.consume('report_generation', message => {
    if (message) {
      consumeReportJob(message, channel);
    }
  });

  logger.info('Report worker started - consuming generate_report queue');
}
