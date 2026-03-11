import { getChannel } from './get-channel';

export async function publishAnalysisIssues(payload: any) {
  const channel = await getChannel();

  channel.sendToQueue('analysis_issues', Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
}
