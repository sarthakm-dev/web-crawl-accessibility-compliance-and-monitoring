import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatBox } from '@/components/cards/StatBox';
import { JobRow } from '@/components/cards/JobRow';
import { AccessibilityTrendChart } from '@/components/charts/AccessibilityTrendChart';
import { IssueBreakdownChart } from '@/components/charts/IssueBreakdownChart';

export default function Dashboard() {
  return (
    <div className="flex-1 min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 p-6 space-y-6">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        <StatBox title="Active Sites" value="24" />
        <StatBox title="Active Crawls" value="3" />
        <StatBox title="Open Issues" value="732" />
        <StatBox title="Compliance Score" value="78%" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Accessibility Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AccessibilityTrendChart />
            <p className="text-sm text-green-600 mt-3">+6% from last week</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Issue Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <IssueBreakdownChart />
          </CardContent>
        </Card>

        <Card className="rounded-2xl  shadow-lg bg-linear-to-br from-blue-600 to-blue-800 text-white">
          <CardContent className="flex flex-col justify-between h-full p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Maintain accessibility compliance
              </h3>

              <p className=" text-base mt-4 opacity-90">
                Automated web crawls to identify WCAG violations such as missing
                alternative text, insufficient color contrast, broken form
                labels that often go unnoticed during manual checks.
              </p>
            </div>

            <Button className="mt-6 bg-white text-blue-700 hover:bg-gray-100">
              Start New Crawl
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-md bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Latest Crawl Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <JobRow site="Google.com" status="In Progress" pages="3" />
          <JobRow site="Amazon.in" status="Failed" pages="4" />
          <JobRow site="Gmail.com" status="Completed" pages="5" />
          <JobRow site="Mums.io" status="Completed" pages="6" />
        </CardContent>
      </Card>
    </div>
  );
}
