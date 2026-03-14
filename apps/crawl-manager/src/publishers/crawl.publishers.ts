import amqp from 'amqplib';
import { env } from '@packages/shared-config/env';
let channel: amqp.Channel;

export async function initPublisher() {
  const connection = await amqp.connect(env.RABBITMQ_URL!);
  channel = await connection.createChannel();
  await channel.assertQueue('crawl_jobs');
}

export async function publishCrawlJob(payload: any) {
  channel.sendToQueue('crawl_jobs', Buffer.from(JSON.stringify(payload)));
}
