import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type AuthState } from '../../../../packages/shared-types/auth.types';

export const useAuthStore = create<AuthState & { isInitialized: boolean }>()(
  persist(
    devtools(
      (set, get) => ({
        user: null,
        isInitialized: false,

        setUser: user =>
          set({ user, isInitialized: true }, false, 'auth/setUser'),

        clearUser: () =>
          set({ user: null, isInitialized: true }, false, 'auth/clearUser'),

        hasPermission: permission => {
          const user = get().user;
          return user?.permissions?.includes(permission) ?? false;
        },
      }),
      { name: 'AuthStore' }
    ),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }),
    }
  )
);
