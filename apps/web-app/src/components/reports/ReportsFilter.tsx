import { useEffect, useState } from 'react';
import api from '@/utils/api';

import { Button } from '@/components/ui/button';
import {
Select,
SelectItem,
SelectContent,
SelectTrigger,
SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import type { FilterProps, Site } from '@/types/report.types';

export function ReportsFilters({
siteId,
setSiteId,
startDate,
endDate,
setStartDate,
setEndDate,
onGenerate,
}: FilterProps) {

const [sites, setSites] = useState<Site[]>([]);
const [loading, setLoading] = useState(false);

const today = new Date().toISOString().split('T')[0];

useEffect(() => {
async function fetchSites() {
try {
setLoading(true);

    const res = await api.get('/api/sites?limit=100');

    setSites(res.data.data || []);

  } catch (err) {
    console.error('Failed to load sites', err);
  } finally {
    setLoading(false);
  }
}

fetchSites();

}, []);

return (
<div className="flex gap-10 items-end rounded-lg border-none">

  {/* Site Dropdown */}
  <div className="flex flex-col gap-1">
    <label className="text-sm">Site</label>

    <Select value={siteId} onValueChange={setSiteId}>
      <SelectTrigger className="w-65 bg-white">
        <SelectValue placeholder="Select site" />
      </SelectTrigger>

      <SelectContent>
        {loading && (
          <SelectItem value="loading" disabled>
            Loading sites...
          </SelectItem>
        )}

        {!loading && sites.length === 0 && (
          <SelectItem value="empty" disabled>
            No sites available
          </SelectItem>
        )}

        {sites.map(site => (
          <SelectItem key={site.id} value={site.id}>
            {site.name} ({site.base_url})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Start Date */}
  <div className="flex flex-col gap-1">
    <label className="text-sm">Start Date</label>

    <Input
      className="bg-white"
      type="date"
      value={startDate}
      max={today}
      onChange={e => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div className="flex flex-col gap-1">
    <label className="text-sm">End Date</label>

    <Input
      className="bg-white"
      type="date"
      value={endDate}
      max={today}
      min={startDate}
      onChange={e => setEndDate(e.target.value)}
    />
  </div>

  {/* Generate Button */}
  <Button
    className="bg-blue-600 hover:bg-blue-700"
    onClick={onGenerate}
    disabled={!siteId || new Date(endDate) < new Date(startDate)}
  >
    Generate Report
  </Button>

</div>

);
}