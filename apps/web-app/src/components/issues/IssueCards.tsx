import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { getImpactColor, getStatusColor } from '@/utils/color';
import { useAuthStore } from '@/store/authStore';
import { statusOptions } from '@/config/issue-config';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { IssuesTableProps } from '../../../../../packages/shared-types/issue.types';

export function IssuesCardList({
  issues,
  onSelect,
  onStatusChange,
}: IssuesTableProps) {
  const hasPermission = useAuthStore(state => state.hasPermission);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your issues at one place
          </p>
        </div>
      </div>
      {issues.map(issue => (
        <Card
          key={issue.id}
          className="p-5 border-none rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
          onClick={() => onSelect(issue)}
        >
          <div className="flex justify-between items-start gap-4">
            {/* Left Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`${getImpactColor(issue.impact)} capitalize`}>
                  {issue.impact}
                </Badge>

                {/* Status Dropdown */}
                {hasPermission('issue:update') && (
                  <div onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge
                          className={`${getStatusColor(issue.status)} capitalize`}
                        >
                          {issue.status.replace("_"," ")}
                        </Badge>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        {statusOptions.map(status => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onStatusChange(issue.id, status)}
                            className="capitalize"
                          >
                            {issue.status === status && (
                              <Check className="h-4 w-4" />
                            )}
                            {status.replace('_', ' ')}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              <p className="font-medium text-base line-clamp-2">
                {issue.title}
              </p>

              <p className="text-sm text-muted-foreground break-all line-clamp-1">
                {issue.url}
              </p>

              <p className="text-xs text-muted-foreground">
                First detected: {issue.firstDetected}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
