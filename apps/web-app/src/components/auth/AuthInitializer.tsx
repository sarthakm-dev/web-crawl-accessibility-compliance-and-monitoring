import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import api from '@/utils/api';

let initialized = false;

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore(s => s.setUser);
  const clearUser = useAuthStore(s => s.clearUser);

  useEffect(() => {
    if (initialized) return;
    initialized = true;

    const initAuth = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (res.data) {
          setUser(res.data);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      }
    };

    initAuth();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
