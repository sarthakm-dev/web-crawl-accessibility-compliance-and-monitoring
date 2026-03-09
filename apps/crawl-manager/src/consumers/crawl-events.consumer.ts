import amqp from 'amqplib';
import { getIO } from '../socket/server';

export async function startCrawlEventsConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue('crawl_events', { durable: true });

  console.log('Listening for crawl events...');

  channel.consume(
    'crawl_events',
    async msg => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        console.log('Crawl event received:', event);

        const io = getIO();

        io.emit('crawl-job-updated', event);

        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process crawl event', err);
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}
