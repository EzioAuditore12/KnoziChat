import axios from 'axios';
import { useAuthStore } from '@/store';
import { env } from '@/env';
import { refreshTokensApi } from './refresh.token.api';

const authenticatedAxiosInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
});

authenticatedAxiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokens?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authenticatedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        const refreshToken = useAuthStore.getState().tokens?.refreshToken;

        if (!refreshToken) throw new Error('No refresh token available');

        const data = await refreshTokensApi({
          refreshToken,
        });

        useAuthStore.getState().setUserTokens(data);

        // Fix this line - use data.accessToken instead of data.tokens.accessToken
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authenticatedAxiosInstance(originalRequest);
      } catch (e) {
        console.log(e);
        alert('Session expired. Please login again.');
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default authenticatedAxiosInstance;
