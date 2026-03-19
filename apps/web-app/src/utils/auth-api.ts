import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth-store';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor to swallow 401 errors
authApi.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearUser();
      return new Promise(() => {});
    }
    return Promise.reject(err);
  }
);

export default authApi;
