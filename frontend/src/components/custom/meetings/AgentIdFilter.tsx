import { useMeetingsFilters } from "@/hooks/useMeetingsFilters";
import { agentsApi } from "@/services/agentsApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CommandSelect from "./CommandSelect";
import GeneratedAvatar from "../GeneratedAvatar";



function AgentIdFilter() {
    const [filters, setFilters] = useMeetingsFilters();
    const [agentSearch, setAgentSearch] = useState("");
    const { data } = useQuery({
        queryKey: ["agents", { search: agentSearch }],
        queryFn: () => {
            return agentsApi.getAgents({
                pageSize: 100,
                search: agentSearch,
            })
        }
    })

    return (
        <CommandSelect
            className="h-9"
            placeholder="Agent"
            options={(data?.data ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2" >
                        <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-4"
                        />
                        {agent.name}
                    </div>
                )
            }))}
            onSelect={(value) => setFilters({ agentId: value })}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ""}
        />
    );
}

export default AgentIdFilter;