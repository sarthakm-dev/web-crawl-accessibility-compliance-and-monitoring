import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/cards/StatCard";
import { IssueRow } from "@/components/cards/IssueRow";

export default function Dashboard() {
  return (
    <div className="h-screen flex overflow-hidden bg-linear-to-br from-blue-100 to-blue-300 min-h-screen">
        
      

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">

        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Sites" value="24" change="+2" />
          <StatCard title="Open Issues" value="732" change="+8" />
          <StatCard title="High Severity" value="121" change="-12" />
          <StatCard title="Compliance Score" value="78%" change="-2%" />
        </div>

      
        <div className="grid grid-cols-3 gap-6">

     
          <Card className="col-span-2 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Latest Crawl</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Progress value={65} />
              <div className="grid grid-cols-3 text-sm text-gray-600">
                <div>
                  <p className="font-bold text-lg">3,850</p>
                  Pages Crawled
                </div>
                <div>
                  <p className="font-bold text-lg">732</p>
                  Issues Found
                </div>
                <div>
                  <p className="font-bold text-lg">35%</p>
                  High Severity
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-linear-to-br from-blue-600 to-blue-800 text-white">
            <CardContent className="flex flex-col justify-between h-full p-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Maintain accessibility compliance
                </h3>
                <p className="text-sm opacity-90">
                  Automated web crawls to identify WCAG violations.
                </p>
              </div>

              <Button className="mt-6 bg-white text-blue-700 hover:bg-gray-100">
                Start New Crawl
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Open Accessibility Issues</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <IssueRow
                title="Missing Alt Text"
                site="example.com"
                severity="Critical"
                pages={64}
                status="Open"
              />
              <IssueRow
                title="Poor Color Contrast"
                site="site2.com"
                severity="High"
                pages={49}
                status="In Progress"
              />
              <IssueRow
                title="Missing Form Labels"
                site="widgetinc.io"
                severity="Medium"
                pages={27}
                status="Open"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}