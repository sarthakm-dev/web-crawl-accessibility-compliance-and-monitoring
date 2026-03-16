import { getChannel } from './get-channel';

export async function publishAnalysisCompleted(event: {
  siteId: string;
  jobId: string;
}) {
  const channel = await getChannel();
  // Publish analysis events for real time updates
  channel.sendToQueue('analysis_events', Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
}
