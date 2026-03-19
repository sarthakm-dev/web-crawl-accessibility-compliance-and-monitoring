import amqp from 'amqplib';
import { env } from '@packages/shared-config/env';

let channel: amqp.Channel;

export async function getChannel() {
  if (!channel) {
    //create rabbitmq connection
    const connection = await amqp.connect(env.RABBITMQ_URL!);
    channel = await connection.createChannel();
  }
  return channel;
}

export async function publishToAnalysis(payload: any) {
  const ch = await getChannel();
  // setup publisher to add jobs for analysis
  ch.sendToQueue('analysis_jobs', Buffer.from(JSON.stringify(payload)));
}
