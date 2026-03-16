import { getChannel } from './get-channel';

export async function publishAnalysisIssues(payload: any) {
  const channel = await getChannel();
  // Publish to analysis_issues queue for reporting service
  channel.sendToQueue('analysis_issues', Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
}
