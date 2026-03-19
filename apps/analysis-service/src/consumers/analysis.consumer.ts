import amqp, { Channel } from 'amqplib';
import { AnalysisService } from '../services/analysis.service';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';

const QUEUE = 'analysis_jobs';
const DLQ = 'analysis_jobs_dlq';
const DLX = 'analysis_dlx';

export async function startAnalysisConsumer() {
  async function connect() {
    try {
      const connection = await amqp.connect(env.RABBITMQ_URL!);

      connection.on('error', err => {
        logger.error({ err }, 'RabbitMQ connection error');
      });

      connection.on('close', () => {
        logger.warn('RabbitMQ connection closed. Reconnecting in 5s...');
        setTimeout(connect, 5000);
      });

      const channel: Channel = await connection.createChannel();

      // DLX and DLQ setup
      await channel.assertExchange(DLX, 'direct', { durable: true });

      await channel.assertQueue(DLQ, { durable: true });

      await channel.bindQueue(DLQ, DLX, DLQ);

      // Main Queue with DLQ config

      await channel.assertQueue(QUEUE, {
        durable: true,
        deadLetterExchange: DLX,
        deadLetterRoutingKey: DLQ,
      });

      channel.prefetch(5);

      logger.info('Analysis consumer started');

      // Consume messages

      channel.consume(QUEUE, async msg => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString());

          await AnalysisService.process(payload);

          channel.ack(msg);
        } catch (err) {
          logger.error({ err }, 'Analysis failed');

          channel.nack(msg, false, false);
        }
      });
    } catch (err) {
      logger.error({ err }, 'RabbitMQ connection failed. Retrying in 5s...');
      setTimeout(connect, 5000);
    }
  }

  connect();
}
