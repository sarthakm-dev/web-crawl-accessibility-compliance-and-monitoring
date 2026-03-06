export interface IssueRowProps {
  title: string;
  site: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  pages: number;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export type Issue = {
  id: string;
  url: string;
  title: string;
  status: 'open' | 'all' | 'in_progress' | 'resolved' | 'closed';
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  firstDetected: string;
  selector: string;
  wcag_reference?: string;
};

export type IssueApiResponse = {
  id: string;
  message: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  current_status: 'open' | 'in_progress' | 'resolved' | 'closed';
  first_detected_at: string;
  element_selector: string;
  IssueDefinition?: {
    wcag_reference: string;
  };
  PageVersion?: {
    selector?: string;
    Page?: {
      url: string;
    };
  };
};

export type IssueDetailApiResponse = IssueApiResponse & {
  IssueStatusHistories: {
    id: string;
    new_status: string;
    previous_status: string | null;
    changed_at: string;
    note: string | null;
    User?: {
      name: string;
      email: string;
    };
  }[];
  IssueNotes: {
    id: string;
    note: string;
    created_at: string;
    User?: {
      name: string;
      email: string;
    };
  }[];
};

export type IssueDetail = Issue & {
  IssueStatusHistories: IssueDetailApiResponse['IssueStatusHistories'];
  IssueNotes: IssueDetailApiResponse['IssueNotes'];
};

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Props {
  issue: IssueDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: IssueStatus) => void;
  onAddComment: (issueId: string, note: string) => Promise<void>;
}
export interface IssuesTableProps {
  issues: Issue[];
  onSelect: (issue: Issue) => void;
  onStatusChange: (id: string, status: Issue['status']) => void;
  search: string;
  status: string;
  limit: number;
  setSearchParams: (params: Record<string, string>) => void;
}
