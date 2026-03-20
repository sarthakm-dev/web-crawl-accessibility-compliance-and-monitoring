import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TrashIcon } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import type { DeleteSiteDialogProps } from '@/types/sites.types';

export function DeleteSiteDialog({ siteId, onDeleted }: DeleteSiteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          size="icon"
          onClick={e => e.stopPropagation()}
        >
          <TrashIcon className="text-red-500" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this site?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async e => {
              e.stopPropagation();
              try {
                await api.delete(`/api/sites/${siteId}`);
                onDeleted(siteId);
                toast.success('Site deleted');
              } catch {
                toast.error('Failed to delete site');
              }
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
