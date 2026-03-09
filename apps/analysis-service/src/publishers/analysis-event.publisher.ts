import amqp from 'amqplib';
let channel: amqp.Channel;

export async function getChannel() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertQueue('analysis_jobs');
  }
  return channel;
}

export async function publishAnalysisCompleted(event: {
  siteId: string;
  jobId: string;
}) {
  const channel = await getChannel();

  channel.sendToQueue('analysis_events', Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
}
