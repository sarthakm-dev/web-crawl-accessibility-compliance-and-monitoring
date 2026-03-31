import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import api from '@/utils/api';
import { toast } from 'sonner';
import type { CreateSiteDialogProps } from '@/types/sites.types';

export function CreateSiteDialog({ onCreated }: CreateSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [scheduledCrawlTime, setScheduledCrawlTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await api.post('/api/sites', {
        name,
        baseUrl,
        scheduledCrawlTime: scheduledCrawlTime || undefined,
      });
      setOpen(false);
      setName('');
      setBaseUrl('');
      setScheduledCrawlTime('');
      await onCreated();
      toast.success('Site created successfully');
    } catch {
      toast.error('Failed to create site');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm">
          + Add Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription>
            Enter the details for your new site below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Site Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="https://example.com"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
          />
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="scheduled-crawl-time"
            >
              Daily crawl time
            </label>
            <Input
              id="scheduled-crawl-time"
              type="time"
              value={scheduledCrawlTime}
              onChange={e => setScheduledCrawlTime(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to keep manual crawls only.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={submitting || !name || !baseUrl}
            className="bg-blue-700 hover:bg-blue-800 shadow-sm"
          >
            {submitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
