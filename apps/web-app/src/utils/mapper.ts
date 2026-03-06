import type {
  Issue,
  IssueApiResponse,
  IssueDetail,
  IssueDetailApiResponse,
} from '../types/issue.types';

export const mapIssue = (item: IssueApiResponse): Issue => ({
  id: item.id,
  url: item.PageVersion?.Page?.url ?? '',
  title: item.message,
  status: item.current_status,
  impact: item.impact,
  firstDetected: new Date(item.first_detected_at).toLocaleString(),
  selector: item.element_selector,
  wcag_reference: item.IssueDefinition?.wcag_reference,
});

export const mapIssueDetail = (
  detailed: IssueDetailApiResponse
): IssueDetail => ({
  id: detailed.id,
  url: detailed.PageVersion?.Page?.url ?? '',
  title: detailed.message,
  status: detailed.current_status,
  impact: detailed.impact,
  firstDetected: new Date(detailed.first_detected_at).toLocaleString(),
  selector: detailed.element_selector,
  wcag_reference: detailed.IssueDefinition?.wcag_reference,
  IssueStatusHistories: detailed.IssueStatusHistories ?? [],
  IssueNotes: detailed.IssueNotes ?? [],
});
