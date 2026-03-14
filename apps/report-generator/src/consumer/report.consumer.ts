import amqp from 'amqplib';
import { consumeReportJob } from '../workers/report.worker';
import { env } from '@packages/shared-config/env';

export async function startReportWorker() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);

  const channel = await connection.createChannel();

  await channel.assertQueue('report_generation', {
    durable: true,
  });

  channel.prefetch(5);

  channel.consume('report_generation', message => {
    if (message) {
      consumeReportJob(message, channel);
    }
  });

  console.log('Report worker started - consuming generate_report queue');
}
