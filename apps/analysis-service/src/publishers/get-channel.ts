import amqp from 'amqplib';
let channel: amqp.Channel;

export async function getChannel() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertQueue('analysis_jobs');
    await channel.assertQueue('analysis_jobs');
  }
  return channel;
}
