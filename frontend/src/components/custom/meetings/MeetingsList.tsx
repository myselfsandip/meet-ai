import { meetingsApi } from "@/services/meetingsApi";
import type { MeetingsListResponse } from "@/types/meetingsTypes";
import { DEFAULT_PAGE } from "@/utils/constants";
import { useSuspenseQuery } from "@tanstack/react-query";

function MeetingsList() {
    const filters = { search: '', page: DEFAULT_PAGE };
    const { data } = useSuspenseQuery<MeetingsListResponse>({
        queryKey: ['meetings', filters],
        queryFn: () => meetingsApi.getMeetings(filters),
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}

export default MeetingsList;