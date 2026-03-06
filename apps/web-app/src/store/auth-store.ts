import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type AuthState } from '../../../../packages/shared-types/auth.types';

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,

      setUser: user => set({ user }, false, 'auth/setUser'),

      clearUser: () => set({ user: null }, false, 'auth/clearUser'),

      hasPermission: permission => {
        const user = get().user;
        return user?.permissions?.includes(permission) ?? false;
      },
    }),
    { name: 'AuthStore' }
  )
);
