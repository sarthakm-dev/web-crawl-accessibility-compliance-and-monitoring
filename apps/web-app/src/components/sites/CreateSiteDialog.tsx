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
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await api.post('/api/sites', { name, baseUrl });
      setOpen(false);
      setName('');
      setBaseUrl('');
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
      <DialogContent aria-describedby="add-site-desc" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription id="add-site-desc">
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
