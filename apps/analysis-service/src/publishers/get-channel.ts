import { env } from '@packages/shared-config/env';
import amqp from 'amqplib';
let channel: amqp.Channel;

export async function getChannel() {
  if (!channel) {
    const connection = await amqp.connect(env.RABBITMQ_URL!);
    channel = await connection.createChannel();
  }
  return channel;
}
