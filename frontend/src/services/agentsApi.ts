import type { AgentGetOneResponse, AgentInterface, createAgentCredentials, GetAgentsResponse } from '@/types/agentsTypes';
import apiClient from './apiClient';


export const agentsApi = {
    getAgents: async (): Promise<GetAgentsResponse> => {
        const response = await apiClient.get('/api/agents/');
        return response.data;
    },
    getOneAgent: async (id: string): Promise<AgentGetOneResponse> => {
        const response = await apiClient.get(`api/agents/${id}`);
        return response.data;
    },
    createAgent: async (credentials: createAgentCredentials): Promise<AgentInterface> => {
        const response = await apiClient.post(`/api/agents/`, credentials);
        return response.data;
    }
};