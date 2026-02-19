export function JobRow({
  site,
  status,
  pages,
}: {
  site: string;
  status: string;
  pages: string;
}) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div>
        <p className="font-medium">{site}</p>
        <p className="text-xs text-gray-500">{pages} pages</p>
      </div>

      <span
        className={`text-xs px-3 py-1 rounded-full ${
          status === "Completed"
            ? "bg-green-100 text-green-600"
            : status === "Failed"
            ? "bg-red-100 text-red-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
}