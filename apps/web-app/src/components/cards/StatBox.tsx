import { Card, CardContent } from "../ui/card";

export function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <Card className="rounded-2xl border-none shadow-md bg-white/80 backdrop-blur">
      <CardContent className="p-6">
        <p className="md:text-sm text-sm font-medium text-vlack-500 mb-1">{title}</p>
        <p className="md:text-2xl text-md font-bold text-blue-700">{value}</p>
      </CardContent>
    </Card>
  );
}