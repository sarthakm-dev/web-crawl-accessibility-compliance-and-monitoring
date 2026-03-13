import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 text-center px-6">

      <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />

      <h1 className="text-6xl font-bold text-gray-900">
        404
      </h1>

      <p className="text-xl font-medium mt-2">
        Page not found
      </p>

      <p className="text-muted-foreground mt-2 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <div className="flex gap-4 mt-6">

        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Go to Dashboard
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>

      </div>

    </div>
  );
}