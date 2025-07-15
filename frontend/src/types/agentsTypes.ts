export interface AgentModel { // Agent model
    id: string;
    name: string;
    userId: number;
    instructions: string;
    createdAt: string;
    updatedAt: string;
}

// Response when fetching all agents
export interface AgentsListResponse {
    data: AgentModel[];
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
