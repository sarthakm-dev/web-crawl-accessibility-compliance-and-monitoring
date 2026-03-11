import { getChannel } from './get-channel';

export async function publishAnalysisCompleted(event: {
  siteId: string;
  jobId: string;
}) {
  const channel = await getChannel();

  channel.sendToQueue('analysis_events', Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
}
