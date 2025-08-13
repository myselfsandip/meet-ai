import { useSuspenseQuery } from "@tanstack/react-query"
import type { MeetingsFilters, MeetingsListResponse } from "@/types/meetingsTypes";
import { meetingsApi } from "@/services/meetingsApi";
import { useMeetingsFilters } from "./useMeetingsFilters";

const useMeetings = (): MeetingsListResponse => {
    const [filters] = useMeetingsFilters();
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