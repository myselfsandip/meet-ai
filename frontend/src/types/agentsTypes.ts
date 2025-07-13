export interface AgentInterface {
    id: string,
    name: string,
    userId: Number,
    instructions: string,
    createdAt: string,
    updatedAt: string
}

export interface GetAgentsResponse{
    data: AgentInterface[]
}
export interface AgentGetOneResponse{
    data: AgentGetOneResponse
}

export interface createAgentCredentials {
    name: string;
    instructions: string;
}