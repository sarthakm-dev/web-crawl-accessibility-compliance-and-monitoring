import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { getImpactColor, getStatusColor } from '@/utils/color';
import { useAuthStore } from '@/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { Issue, IssuesTableProps } from '../../types/issue.types';
import { useCallback, useEffect, useState } from 'react';
import { TableFilters } from '../common/TableFilters';
import { issueFilterConfig } from '@/config/table-filter-config';

export function IssuesCardList({
  issues,
  onSelect,
  onStatusChange,
  search,
  status,
  limit,
  setSearchParams,
}: IssuesTableProps) {
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [searchInput, setSearchInput] = useState(search);
  const updateParams = useCallback(
    (params: Record<string, string>) => {
      setSearchParams({
        page: params.page ?? '1',
        limit: params.limit ?? limit.toString(),
        search: params.search ?? search,
        status: params.status ?? status,
      });
    },
    [setSearchParams, limit, search, status]
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get('page') || '1';

      setSearchParams({
        page: currentPage,
        limit: limit.toString(),
        search: searchInput,
        status,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput, setSearchParams, limit, status]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your issues at one place
          </p>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        search={searchInput}
        status={status}
        limit={limit}
        statusOptions={issueFilterConfig.statusOptions}
        limitOptions={issueFilterConfig.limitOptions}
        searchPlaceholder="Search issues..."
        onSearchChange={setSearchInput}
        onStatusChange={value => updateParams({ status: value })}
        onLimitChange={value => updateParams({ limit: value })}
      />

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
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        {issueFilterConfig.statusOptions.map(status => (
                          <DropdownMenuItem
                            key={status.label}
                            onClick={() =>
                              onStatusChange(
                                issue.id,
                                status.value as Issue['status']
                              )
                            }
                            className="capitalize"
                          >
                            {issue.status === status.value && (
                              <Check className="h-4 w-4" />
                            )}
                            {status.label.replace('_', ' ')}
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
              <p className="text-sm text-muted-foreground break-all">
                Element: {issue.selector}
              </p>
              <p className="text-sm text-muted-foreground">
                First detected: {issue.firstDetected}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
