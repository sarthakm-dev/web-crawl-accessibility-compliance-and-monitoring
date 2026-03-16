import amqp from 'amqplib';
import { getIO } from '../socket/server';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';

export async function startCrawlEventsConsumer() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue('crawl_events', { durable: true });

  logger.info('Listening for crawl events...');

  channel.consume(
    'crawl_events',
    async msg => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        logger.info('Crawl event received:', event);

        const io = getIO();
        // Send job updated broadcast to client
        io.emit('crawl-job-updated', event);

        channel.ack(msg);
      } catch (err) {
        logger.error({ err }, 'Failed to process crawl event');
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}
