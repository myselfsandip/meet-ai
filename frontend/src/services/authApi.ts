import { useAuthStore } from '@/stores/authStore';
import type { AuthResponse, LoginResponse, RefreshResponse, SignInCredentials, SignUpCredentials, SignUpResponse } from "@/types/auth";
import apiClient, { API_BASE_URL } from './apiClient';
import axios from 'axios';

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
        const response = await axios.post(API_BASE_URL + '/api/auth/refresh', {}, { withCredentials: true });  // Standalone API Call so that interceptors loop issue does not appear 
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