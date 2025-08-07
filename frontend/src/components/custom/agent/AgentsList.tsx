import { columns } from "@/components/custom/agent/Columns";
import DataPagination from "@/components/custom/DataPagination";
import { DataTable } from "@/components/custom/DataTable";
import EmptyState from "@/components/custom/EmptyState";
import useAgents from "@/hooks/useAgents";
import { useFilters } from "@/hooks/useFilters";
import { useNavigate } from "react-router-dom";

function AgentsList() {
    const { data, totalPages } = useAgents();
    const [filters, setFilters] = useFilters();
    const navigate = useNavigate();

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} onRowClick={(row) => navigate(`/agents/${row.id}`)} />
            <DataPagination
                page={filters.page}
                totalPages={totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.length === 0 && (
                <EmptyState
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
                />
            )}
        </div>
    );
}

export default AgentsList;
