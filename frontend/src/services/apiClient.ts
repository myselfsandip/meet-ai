// src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import type { RefreshResponse } from '@/types/auth';

export const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});


export const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
}

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;
        console.log('API Error Status:', error.response?.status);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(originalRequest)
                    })
                })
            }
            isRefreshing = true;
            try {
                const response = await refreshClient.post<RefreshResponse>('/api/auth/refresh');
                console.log(refreshClient)
                const newAccessToken = response.data.token;
                const user = useAuthStore.getState().user;
                useAuthStore.getState().setAuth(response.data.user, newAccessToken);
                onRefreshed(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.replace('/signin');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;