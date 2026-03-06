import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IssueDetailsSheet } from '@/components/issues/IssueDetails';
import { IssuesCardList } from '@/components/issues/IssueCards';
import {
  type IssueDetail,
  type Issue,
  type IssueDetailApiResponse,
} from '../types/issue.types';
import api from '@/utils/api';
import { mapIssueDetail, mapIssue } from '@/utils/mapper';
import { PaginationControls } from '@/components/common/Pagination';

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetail | null>(null);
  const [open, setOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';

  const [total, setTotal] = useState(0);

  const handleSelect = async (issue: Issue) => {
    const res = await api.get<IssueDetailApiResponse>(
      `/api/issues/${issue.id}`
    );

    setSelectedIssue(mapIssueDetail(res.data));
    setOpen(true);
  };

  const handleStatusChange = async (id: string, status: Issue['status']) => {
    await api.patch(`/api/issues/${id}/status`, { status });

    setIssues(prev =>
      prev.map(issue => (issue.id === id ? { ...issue, status } : issue))
    );

    if (selectedIssue?.id === id) {
      const res = await api.get<IssueDetailApiResponse>(`/api/issues/${id}`);
      setSelectedIssue(mapIssueDetail(res.data));
    }
  };

  const handleAddComment = async (id: string, note: string) => {
    await api.post(`/api/issues/${id}/notes`, { note });

    const res = await api.get<IssueDetailApiResponse>(`/api/issues/${id}`);
    setSelectedIssue(mapIssueDetail(res.data));
  };

  useEffect(() => {
    const loadIssues = async () => {
      const res = await api.get(
        `/api/issues?page=${page}&limit=${limit}&search=${search}&status=${status}`
      );

      setIssues(res.data.rows.map(mapIssue));
      setTotal(res.data.count);
    };
    loadIssues();
  }, [page, search, status, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      
      {/* Issues */}
      <IssuesCardList
        issues={issues}
        onSelect={handleSelect}
        onStatusChange={handleStatusChange}
        search={search}
        status={status}
        limit={limit}
        setSearchParams={setSearchParams}
      />

      {/* Pagination */}
      <PaginationControls
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        status={status}
        setSearchParams={setSearchParams}
      />

      {/* Issue Details */}
      <IssueDetailsSheet
        issue={selectedIssue}
        open={open}
        onOpenChange={setOpen}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
