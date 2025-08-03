export interface AgentModel { // Agent model
    id: string;
    name: string;
    userId: number;
    instructions: string;
    createdAt: string;
    updatedAt: string;
    meetingCount: number;
}


// Response when fetching all agents
export interface AgentsListResponse {
    data: AgentModel[];
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

export interface UpdateAgentDTO {
    id: string;
    name: string;
    instructions: string;
}


export interface AgentsFilters {
    search: string;
    page: number;
}