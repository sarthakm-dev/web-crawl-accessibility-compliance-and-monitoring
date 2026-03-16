import amqp from 'amqplib';
import { AnalysisService } from '../services/analysis.service';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';
export async function startAnalysisConsumer() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  const queue = 'analysis_jobs';
  await channel.assertQueue(queue, { durable: true });

  logger.info('Waiting for analysis jobs...');

  channel.consume(queue, async msg => {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString());
    try {
      // Start Analysis
      await AnalysisService.process(payload);
      channel.ack(msg);
    } catch (err) {
      logger.error({ err }, 'Analysis failed');
      channel.nack(msg);
    }
  });
}
