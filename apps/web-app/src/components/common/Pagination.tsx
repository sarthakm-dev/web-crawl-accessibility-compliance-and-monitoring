import { Button } from "@/components/ui/button";
import {type PaginationControlsProps} from "@/types/page.types"


export function PaginationControls({
  page,
  limit,
  totalPages,
  search = "",
  status = "",
  setSearchParams,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-end items-center gap-4 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() =>
          setSearchParams({
            page: (page - 1).toString(),
            limit: limit.toString(),
            search,
            status,
          })
        }
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() =>
          setSearchParams({
            page: (page + 1).toString(),
            limit: limit.toString(),
            search,
            status,
          })
        }
      >
        Next
      </Button>
    </div>
  );
}