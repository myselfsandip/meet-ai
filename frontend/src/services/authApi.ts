import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    accessToken: string;
}

export interface RefreshResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookies/sessions
});

export const authApi = {
    // Login with email and password
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post('/api/auth/signin', credentials);
        return response.data;
    },

    // Get access token from refresh token
    refreshToken: async (): Promise<RefreshResponse> => {
        const response = await apiClient.get('/api/auth/refresh');
        return response.data;
    },

    // Logout user
    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout');
    },

    // Get Google OAuth URL
    getGoogleAuthUrl: (): string => {
        return `${API_BASE_URL}/api/auth/google`;
    },
};