import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import type { SummaryProps } from "@/types/report.types";

export function ExportSection({ siteId, startDate, endDate }: SummaryProps) {

  const exportMutation = useMutation({
    mutationFn: async () => {

      const res = await api.post("/api/reports/export", {
        siteId,
        reportType: "pdf",
        filters: {
          startDate,
          endDate,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success(
        "Report generation started. You will receive an email when ready."
      );
    },

    onError: () => {
      toast.error("Failed to generate report");
    },
  });

  function handleExport() {
    if (!siteId) {
      toast.warning("Please select a site first");
      return;
    }

    exportMutation.mutate();
  }

  return (
    <div className="border-none rounded-lg p-4 bg-white">

      <h2 className="font-semibold mb-4">
        Export Report
      </h2>

      <div className="flex gap-4">

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exportMutation.isPending}
        >
          {exportMutation.isPending
            ? "Generating..."
            : "Generate PDF"}
        </Button>

      </div>

    </div>
  );
}