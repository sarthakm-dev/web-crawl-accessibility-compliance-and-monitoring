import amqp from 'amqplib';
import { AnalysisService } from '../services/analysis.service';

export async function startAnalysisConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  const queue = 'analysis_jobs';
  await channel.assertQueue(queue, { durable: true });

  console.log('Waiting for analysis jobs...');

  channel.consume(queue, async msg => {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString());
    console.log(payload);
    try {
      await AnalysisService.process(payload);
      channel.ack(msg);
    } catch (err) {
      console.error('Analysis failed:', err);
      channel.nack(msg);
    }
  });
}
