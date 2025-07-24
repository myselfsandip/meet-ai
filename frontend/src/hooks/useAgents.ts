import { agentsApi } from "@/services/agentsApi"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAgentsFilters } from "./useAgentsFilters"
import type { AgentsFilters, AgentsListResponse } from "@/types/agentsTypes";

const useAgents = (): AgentsListResponse => {
    const [filters] = useAgentsFilters();
    return useSuspenseQuery<
        AgentsListResponse, 
        Error,             
        AgentsListResponse, 
        [string, AgentsFilters] 
    >({
        queryKey: ['agents', filters],
        queryFn: ({ queryKey }) => {
            const [_key, filters] = queryKey;
            return agentsApi.getAgents(filters)
        },
    }).data
}

export default useAgents;