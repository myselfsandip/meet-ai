import { columns } from "@/components/custom/agent/Columns";
import { DataTable } from "@/components/custom/agent/DataTable";
import EmptyAgentsState from "@/components/custom/agent/EmptyAgentsState";
import useAgents from "@/hooks/useAgents";

function AgentsList() {
    const { data } = useAgents();

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} />
            {data.length === 0 && (
                <EmptyAgentsState
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
                />
            )}
        </div>
    );
}

export default AgentsList;
