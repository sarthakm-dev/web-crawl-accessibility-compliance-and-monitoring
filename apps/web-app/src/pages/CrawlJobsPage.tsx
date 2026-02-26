import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/utils/api"
import { type CrawlJob } from "../../../../packages/shared-types/crawl-job.types"


export default function CrawlJobsPage() {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const status = searchParams.get('status') || 'all';
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/crawl?page=${page}`)
        setJobs(res.data.data ?? []);
        setTotalPages(res.data.pagination.totalPages);
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [page])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        )
      case "running":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Running
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8">

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Crawl Jobs
        </h1>
        <p className="text-muted-foreground">
          Monitor crawl execution history
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {jobs.length} crawl jobs
        </div>
      </div>

      <Card className="border-none rounded-xl shadow-sm bg-background/60 backdrop-blur-sm">
        <Table className="rounded-xl">
          <TableHeader>
            <TableRow className="border-b bg-muted texe-center border-muted">
              <TableHead className="text-center">Crawl ID</TableHead>
              <TableHead className="text-center">Site ID</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Trigger Type</TableHead>
              <TableHead className="text-center">Requested By</TableHead>
              <TableHead className="text-center">Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  </TableRow>
                ))
              : jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="hover:bg-muted/40 bg-background border-none transition cursor-pointer"
                  >
                    <TableCell className="font-medium text-center">
                      {job.id.slice(0, 8)}...
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {job.site_id.slice(0, 8)}...
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusBadge(job.status)}
                    </TableCell>

                    <TableCell className="text-center">
                      {job.trigger_type}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {job.requested_by.slice(0, 8)}...
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Card>

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
            Page {page} of {totalPages}
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

    </div>
  )
}