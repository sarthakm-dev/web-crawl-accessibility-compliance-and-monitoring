import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { useSitesStore } from '@/store/sites-store';

interface Props {
  siteId: string;
  setSiteId: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  onGenerate: () => void;
}

export function ReportsFilters({
  siteId,
  setSiteId,
  date,
  setDate,
  onGenerate,
}: Props) {
  const sites = useSitesStore(state => state.sites);

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
            {sites.length === 0 && (
              <SelectItem value="loading" disabled>
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

      {/* Date Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Date</label>

        <Input
          className="bg-white"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={onGenerate}
        disabled={!siteId}
      >
        Generate Report
      </Button>
    </div>
  );
}
