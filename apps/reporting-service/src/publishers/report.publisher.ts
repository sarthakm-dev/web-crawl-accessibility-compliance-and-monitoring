import { getChannel } from './get-channel';

export async function publishReportGeneration(payload: any) {
  const channel = await getChannel();

  await channel.assertQueue('report_generation');

  channel.sendToQueue(
    'report_generation',
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
}
