import { useAuthStore } from '@/store/auth-store';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
