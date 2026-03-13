import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '@/utils/api';
import { useAuthStore } from '@/store/auth-store';
import { socket } from '@/utils/socket';
import { toast } from 'sonner';
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
        const res = await api.get('/api/auth/me');
        setIsAuthenticated(true);
        setUser(res.data);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [setUser]);

  useEffect(() => {
    if (isAuthenticated === true) {
      socket.connect();
    } else if (isAuthenticated === false) {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div className="p-10">Checking authentication...</div>;
  }
 
  if (!isAuthenticated) {
    toast.error("You are not logged in");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
