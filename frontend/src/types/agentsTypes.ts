export interface AgentModel { // Agent model
    id: string;
    name: string;
    userId: number;
    instructions: string;
    createdAt: string;
    updatedAt: string;
}

export interface AgentListItemModel extends AgentModel {
    meetingCount: number;
}

// Response when fetching all agents
export interface AgentsListResponse {
    data: AgentListItemModel[];
    total: number;
    totalPages: number;
}

// Response when fetching one agent
export interface AgentDetailResponse {
    data: AgentModel;
}

// Payload when creating a new agent
export interface CreateAgentDTO {
    name: string;
    instructions: string;
}


export interface AgentsFilters {
    search: string;
    page: number;
}