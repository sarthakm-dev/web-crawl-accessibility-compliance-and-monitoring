import amqp, { Channel } from 'amqplib';
import { MetricsService } from '../services/metrics.service';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';
import { getIO } from '../socket/server';

const QUEUE = 'analysis_events';
const DLQ = 'analysis_events_dlq';
const DLX = 'analysis_events_dlx';

export async function startAnalysisEventsConsumer() {
  async function connect() {
    try {
      const connection = await amqp.connect(env.RABBITMQ_URL!);

      connection.on('error', err => {
        logger.error({ err }, 'RabbitMQ connection error');
      });

      connection.on('close', () => {
        logger.warn('RabbitMQ closed. Reconnecting in 5s...');
        setTimeout(connect, 5000);
      });

      const channel: Channel = await connection.createChannel();

      // DLQ setup

      await channel.assertExchange(DLX, 'direct', { durable: true });

      await channel.assertQueue(DLQ, { durable: true });

      await channel.bindQueue(DLQ, DLX, DLQ);

      // Main queue with DLQ
      await channel.assertQueue(QUEUE, {
        durable: true,
        deadLetterExchange: DLX,
        deadLetterRoutingKey: DLQ,
      });

      channel.prefetch(5);

      logger.info('Listening for analysis events...');

      // Consumer
      channel.consume(
        QUEUE,
        async msg => {
          if (!msg) return;

          try {
            const event = JSON.parse(msg.content.toString());

            logger.info({ event }, 'Analysis event received');

            await MetricsService.generate(event.siteId, event.jobId);

            const io = getIO();
            // Send job updated broadcast to client
            io.emit('analysis-job-updated', event);
            channel.ack(msg);
          } catch (err) {
            logger.error({ err }, 'Failed to process analysis event');

            // send to DLQ (no requeue)
            channel.nack(msg, false, false);
          }
        },
        { noAck: false }
      );
    } catch (err) {
      logger.error({ err }, 'Connection failed. Retrying in 5s...');
      setTimeout(connect, 5000);
    }
  }

  connect();
}
