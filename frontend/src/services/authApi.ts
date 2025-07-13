import { useAuthStore } from '@/stores/authStore';
import type { AuthResponse, LoginResponse, RefreshResponse, SignInCredentials, SignUpCredentials, SignUpResponse } from '@/types/auth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';



const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export const authApi = {
    signin: async (credentials: SignInCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post('/api/auth/signin', credentials);
        return response.data;
    },

    signup: async (credentials: SignUpCredentials): Promise<SignUpResponse> => {
        const response = await apiClient.post('/api/auth/signup', credentials);
        return response.data;
    },

    refreshToken: async (): Promise<RefreshResponse> => {
        const response = await apiClient.get('/api/auth/refresh');
        return response.data;
    },

    me: async (): Promise<AuthResponse> => {
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
            throw new Error('No access token available');
        }
        const response = await apiClient.get('/api/auth/me');
        const user = response.data.user;
        if (!user) {
            throw new Error('User not found');
        }
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: accessToken,
        };
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout');
    },

    getGoogleAuthUrl: (): string => {
        return `${API_BASE_URL}/api/auth/google`;
    },
};