import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { storage } from "./storage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = storage.getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const tokens = storage.getTokens();
        if (!tokens?.refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refreshToken: tokens.refreshToken,
        });

        storage.setTokens(data);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        storage.clearTokens();
        // Navigation to login is handled by the auth store listener
      }
    }
    return Promise.reject(error);
  }
);
