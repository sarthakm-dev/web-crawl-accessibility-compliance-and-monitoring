import { Badge } from "@/components/ui/badge";
import {type IssueRowProps} from '../../../../../packages/shared-types/issue.types'


export function IssueRow({
  title,
  site,
  severity,
  pages,
  status,
}: IssueRowProps) {
  const severityStyles = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-gray-100 text-gray-700",
  };

  const statusStyles = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Resolved: "bg-green-100 text-green-700",
  };

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
      <div className="text-gray-700">
        {pages} pages
      </div>
      <div className="flex justify-end p-2">
        <Badge className={`w-fit ${statusStyles[status]}`}>
          {status}
        </Badge>
      </div>
    </div>
  );
}