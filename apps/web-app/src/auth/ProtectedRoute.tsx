import { useAuthStore } from '@/store/auth-store';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const user = useAuthStore(s => s.user);

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
