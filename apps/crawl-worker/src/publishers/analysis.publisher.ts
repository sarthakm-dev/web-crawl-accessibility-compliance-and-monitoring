import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqp.Channel;

export async function getChannel() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertQueue('analysis_jobs');
  }
  return channel;
}

export async function publishToAnalysis(payload: any) {
  const ch = await getChannel();
  ch.sendToQueue('analysis_jobs', Buffer.from(JSON.stringify(payload)));
}
