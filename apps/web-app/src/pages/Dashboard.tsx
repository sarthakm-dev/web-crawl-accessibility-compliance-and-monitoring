import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/utils/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatBox } from '@/components/cards/StatBox';
import { JobRow } from '@/components/cards/JobRow';
import { toast } from 'sonner';
import { AccessibilityTrendChart } from '@/components/charts/AccessibilityTrendChart';
import { IssueBreakdownChart } from '@/components/charts/IssueBreakdownChart';
import { useDashboardSocket } from '@/hooks/useDashboardSocket';

import type { LatestJob } from '@/types/page.types';

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    activeSites: 0,
    activeCrawls: 0,
    openIssues: 0,
    complianceScore: 0,
  });

  const [trend, setTrend] = useState([]);
  const [issues, setIssues] = useState(null);
  const [latestJobs, setLatestJobs] = useState<LatestJob[]>([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const [summaryRes, trendRes, issuesRes, crawlsRes] = await Promise.all([
        api.get('/api/dashboard/summary'),
        api.get('/api/dashboard/trend'),
        api.get('/api/dashboard/issues-breakdown'),
        api.get('/api/dashboard/latest-crawls'),
      ]);

      setSummary(summaryRes.data);
      setTrend(trendRes.data);
      setIssues(issuesRes.data);
      setLatestJobs(crawlsRes.data);
    } catch {
      toast.error('Failed to load dashboard');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Real-time updates
  const handleJobUpdated = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useDashboardSocket(handleJobUpdated);

  return (
    <div className="flex-1 min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 p-6 space-y-6">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        <StatBox title="Active Sites" value={summary.activeSites.toString()} />
        <StatBox
          title="Active Crawls"
          value={summary.activeCrawls.toString()}
        />
        <StatBox title="Open Issues" value={summary.openIssues.toString()} />
        <StatBox
          title="Compliance Score"
          value={summary.complianceScore.toString()}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Accessibility Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AccessibilityTrendChart data={trend} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Issue Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <IssueBreakdownChart data={issues} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-lg bg-linear-to-br from-blue-600 to-blue-800 text-white">
          <CardContent className="flex flex-col justify-between h-full p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Maintain accessibility compliance
              </h3>
              <p className="text-base mt-4 opacity-90">
                Automated web crawls to identify WCAG violations such as missing
                alternative text, insufficient color contrast, broken form
                labels that often go unnoticed during manual checks.
              </p>
            </div>
            <Button
              className="mt-6 bg-white text-blue-700 hover:bg-gray-100"
              onClick={() => navigate('/sites')}
            >
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
          {latestJobs.map(job => (
            <JobRow
              key={job.id}
              site={job.Site?.name || 'Unknown'}
              status={job.status}
              pages={job.pages_crawled?.toString() ?? '0'}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
