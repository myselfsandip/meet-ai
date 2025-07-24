import type { AgentDetailResponse , AgentModel, CreateAgentDTO, AgentsListResponse, AgentsFilters } from '@/types/agentsTypes';
import apiClient from './apiClient';


export const agentsApi = {
    getAgents: async (filters: AgentsFilters): Promise<AgentsListResponse> => {
        const response = await apiClient.get('/api/agents/',{
            params: {
                ...filters
            }
        });
        return response.data;
    },
    getOneAgent: async (id: string): Promise<AgentDetailResponse> => {
        const response = await apiClient.get(`api/agents/${id}`);
        return response.data;
    },
    createAgent: async (credentials: CreateAgentDTO): Promise<AgentModel> => {
        const response = await apiClient.post(`/api/agents/`, credentials);
        return response.data;
    }
};