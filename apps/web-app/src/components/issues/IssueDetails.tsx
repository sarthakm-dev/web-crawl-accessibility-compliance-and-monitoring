import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import Typography from '@mui/material/Typography';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  type Props,
  type IssueStatus,
} from '../../../../../packages/shared-types/issue.types';
import { useState } from 'react';
import { getImpactColor, getStatusColor } from '@/utils/color';
import { useAuthStore } from '@/store/authStore';

export function IssueDetailsSheet({
  issue,
  open,
  onOpenChange,
  onStatusChange,
  onAddComment,
}: Props) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!issue) return null;

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      await onAddComment(issue.id, comment);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-170 max-w-[95vw] overflow-y-auto px-8 py-6 border-l-4 ${
          issue.impact === 'critical'
            ? 'border-red-500'
            : issue.impact === 'serious'
              ? 'border-orange-500'
              : issue.impact === 'moderate'
                ? 'border-yellow-500'
                : 'border-blue-500'
        }`}
      >
        {/* Header */}
        <SheetHeader className="pb-6">
          <SheetTitle className="text-lg font-semibold">
            Issue Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/*  Issue Overview */}
          <div className="space-y-5">
            <h2 className="text-md font-normal leading-relaxed">
              {issue.title}
            </h2>

            <p className="text-sm text-muted-foreground break-all">
              {issue.url}
            </p>

            <div className="flex items-center gap-3">
              <Badge className={`${getImpactColor(issue.impact)} capitalize`}>
                {issue.impact}
              </Badge>

              <Badge className={`${getStatusColor(issue.status)} capitalize`}>
                {issue.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Status Control  */}
          {hasPermission('issue:update') && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">Update Status</p>

              <Select
                value={issue.status}
                onValueChange={value =>
                  onStatusChange(issue.id, value as IssueStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/*  Progress Timeline  */}
          <div className="px-6 space-y-4">
            <p className="text-sm font-semibold">Progress</p>

            <Timeline
              position="right"
              sx={{
                p: 0,
                m: 0,
                width: '100%',
              }}
            >
              {issue.IssueStatusHistories.map((step, index) => {
                const isLatest =
                  index === issue.IssueStatusHistories.length - 1;

                return (
                  <TimelineItem
                    key={step.id}
                    sx={{
                      '&::before': {
                        display: 'none',
                      },
                    }}
                  >
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          backgroundColor: isLatest ? '#2563eb' : '#d1d5db',
                          width: 12,
                          height: 12,
                        }}
                      />
                      {index !== issue.IssueStatusHistories.length - 1 && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        className="capitalize"
                      >
                        {step.new_status.replace('_', ' ')}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {new Date(step.changed_at).toLocaleString()}
                      </Typography>

                      {step.note && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {step.note}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>

          {/*  Comments  */}
          {hasPermission('issue:update') && (
            <div className="bg-background rounded-2xl px-6 space-y-6">
              <p className="text-sm font-semibold">Comments</p>

              <div className="space-y-4">
                {issue.IssueNotes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                )}

                {issue.IssueNotes.map(note => (
                  <div
                    key={note.id}
                    className="p-4 bg-muted rounded-xl space-y-1"
                  >
                    <p className="text-sm">{note.note}</p>

                    <p className="text-xs text-muted-foreground">
                      {note.User?.name ?? 'System'} ·{' '}
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  onClick={handleAddComment}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Comment'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
