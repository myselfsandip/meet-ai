export interface Agent {
    id: string,
    name: string,
    userId: Number,
    instructions: string,
    createdAt: string,
    updatedAt: string
}

export interface GetAgentsResponse{
    data: Agent[]
}
export interface AgentGetOneResponse{
    data: Agent
}