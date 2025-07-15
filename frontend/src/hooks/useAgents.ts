import { agentsApi } from "@/services/agentsApi"
import { useSuspenseQuery } from "@tanstack/react-query"

const useAgents = () => {
    return useSuspenseQuery({
        queryKey: ['agents'],
        queryFn: agentsApi.getAgents
    }).data
}

export default useAgents;