import amqp from 'amqplib';
import { MetricsService } from '../services/metrics.service';

export async function startAnalysisEventsConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue('analysis_events', { durable: true });

  console.log('Listening for analysis events...');

  channel.consume(
    'analysis_events',
    async msg => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        console.log('Analysis event received:', event);

        await MetricsService.generate(event.siteId, event.jobId);

        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process analysis event', err);

        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}
