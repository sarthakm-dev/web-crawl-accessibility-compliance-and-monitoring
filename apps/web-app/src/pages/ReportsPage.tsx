import { useState } from 'react';

import { ReportsFilters } from '@/components/reports/ReportsFilter';
import { SummaryCards } from '@/components/reports/SummaryCards';
import { SeverityChart } from '@/components/charts/SeverityChart';
import { TopPagesTable } from '@/components/reports/TopPageTable';
import { ExportSection } from '@/components/reports/ExportSection';
import { IssuesTable } from '@/components/reports/IssuesTable';

export default function ReportsPage() {
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState('');
  const [activeSite, setActiveSite] = useState('');

  function handleGenerate() {
    setActiveSite(siteId);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <ReportsFilters
        siteId={siteId}
        setSiteId={setSiteId}
        date={date}
        setDate={setDate}
        onGenerate={handleGenerate}
      />

      {activeSite && (
        <>
          <SummaryCards siteId={activeSite} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SeverityChart siteId={activeSite} />
            <TopPagesTable siteId={activeSite} />
          </div>

          <IssuesTable siteId={activeSite} />

          <ExportSection siteId={activeSite} />
        </>
      )}
    </div>
  );
}
