import { meetingsApi } from "@/services/meetingsApi";
import type { EnrichedMeeting, MeetingsListResponse } from "@/types/meetingsTypes";
import { DEFAULT_PAGE } from "@/utils/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
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
        <div >
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