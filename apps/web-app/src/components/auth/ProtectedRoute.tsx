import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/utils/api";
import { useAuthStore } from "@/store/authStore"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser } = useAuthStore.getState();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setIsAuthenticated(true);
        setUser(res.data);
        console.log(res.data);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (isAuthenticated === null) {
    return <div className="p-10">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}