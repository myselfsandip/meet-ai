import { useSuspenseQuery } from "@tanstack/react-query"
import { useFilters } from "./useFilters"
import type { MeetingsFilters, MeetingsListResponse } from "@/types/meetingsTypes";
import { meetingsApi } from "@/services/meetingsApi";

const useMeetings = (): MeetingsListResponse => {
    const [filters] = useFilters();
    const { data } = useSuspenseQuery<
        MeetingsListResponse,
        Error,
        MeetingsListResponse,
        [string, MeetingsFilters]
    >({
        queryKey: ['meetings', filters],
        queryFn: ({ queryKey }) => {
            const [_key, filters] = queryKey;
            return meetingsApi.getMeetings(filters)
        },
    });
    return data;
}
export default useMeetings;