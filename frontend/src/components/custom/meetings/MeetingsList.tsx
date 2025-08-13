import { DataTable } from "@/components/custom/DataTable";
import { columns } from "./Columns"
import { useNavigate } from "react-router-dom";
import EmptyState from "../EmptyState";
import DataPagination from "@/components/custom/DataPagination";
import { useFilters } from "@/hooks/useFilters";
import useMeetings from "@/hooks/useMeetings";

function MeetingsList() {
    const navigate = useNavigate();
    const [filters, setFilters] = useFilters();
    const { data, totalPages } = useMeetings();



    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data} onRowClick={(row) => navigate(`/meetings/${row.id}`)} />
            <DataPagination
                page={filters.page}
                totalPages={totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.length === 0 && (
                <EmptyState
                    title="Create Your First Meeting"
                    description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
                />
            )}
        </div>
    );
}

export default MeetingsList;