import { agentsApi } from "@/services/agentsApi"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useFilters } from "./useFilters"
import type { AgentsFilters, AgentsListResponse } from "@/types/agentsTypes";

const useAgents = (): AgentsListResponse => {
    const [filters] = useFilters();
    const { data } = useSuspenseQuery<
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
    });

    return data;
}

export default useAgents;