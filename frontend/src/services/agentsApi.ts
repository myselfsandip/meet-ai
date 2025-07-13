import { useAuthStore } from '@/stores/authStore';
import type { AgentGetOneResponse, GetAgentsResponse } from '@/types/agentsTypes';
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

export const agentsApi = {
    getAgents: async() : Promise<GetAgentsResponse> => {
        const response = await apiClient.get('/api/agents/');
        return response.data;
    },
    getOneAgent: async(id: string) : Promise<AgentGetOneResponse> => {
        const response = await apiClient.get(`api/agents/${id}` );
        return response.data;
    }
};