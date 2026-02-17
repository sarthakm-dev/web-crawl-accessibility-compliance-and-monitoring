import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../ui/card";

export function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-2">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
          <Badge variant="secondary">{change}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

