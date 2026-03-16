import amqp from 'amqplib';
import { MetricsService } from '../services/metrics.service';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';

export async function startAnalysisEventsConsumer() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue('analysis_events', { durable: true });

  logger.info('Listening for analysis events...');
  // consume messages from analysis_events
  channel.consume(
    'analysis_events',
    async msg => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        logger.info(`Analysis event received: ${event}`);
        // Generate metrics for analysis event
        await MetricsService.generate(event.siteId, event.jobId);

        channel.ack(msg);
      } catch (err) {
        logger.error({ err }, 'Failed to process analysis event');

        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}
