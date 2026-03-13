import { useState } from 'react';

import { ReportsFilters } from '@/components/reports/ReportsFilter';
import { SummaryCards } from '@/components/reports/SummaryCards';
import { SeverityChart } from '@/components/charts/SeverityChart';
import { TopPagesTable } from '@/components/reports/TopPageTable';
import { ExportSection } from '@/components/reports/ExportSection';
import { IssuesCards } from '@/components/reports/IssueDetails';

export default function ReportsPage() {
  const [siteId, setSiteId] = useState("");
  const [activeSite, setActiveSite] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  function handleGenerate() {
    setActiveSite(siteId);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <ReportsFilters
        siteId={siteId}
        setSiteId={setSiteId}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={handleGenerate}
      />

      {activeSite && (
        <>
          <SummaryCards
            siteId={activeSite}
            startDate={startDate}
            endDate={endDate}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SeverityChart
              siteId={activeSite}
              startDate={startDate}
              endDate={endDate}
            />

            <TopPagesTable
              siteId={activeSite}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <IssuesCards
            siteId={activeSite}
            startDate={startDate}
            endDate={endDate}
          />

          <ExportSection
            siteId={activeSite}
            startDate={startDate}
            endDate={endDate}
          />
        </>
      )}
    </div>
  );
}