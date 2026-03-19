import { Badge } from '@/components/ui/badge';
import { type IssueRowProps } from '@/types/issue.types';
import { severityStyles, statusStyles } from '@/config/issue-config';

export function IssueRow({
  title,
  site,
  severity,
  pages,
  status,
}: IssueRowProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-4 border-b last:border-none">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{site}</p>
      </div>

      <div>
        <Badge className={`w-fit ${severityStyles[severity]}`}>
          {severity}
        </Badge>
      </div>
      <div className="text-gray-700">{pages} pages</div>
      <div className="flex justify-end p-2">
        <Badge className={`w-fit ${statusStyles[status]}`}>{status}</Badge>
      </div>
    </div>
  );
}
