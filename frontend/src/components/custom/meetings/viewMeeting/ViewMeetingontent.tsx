import { meetingsApi } from "@/services/meetingsApi";
import type { MeetingDetailResponse } from "@/types/meetingsTypes";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    id: string
}

function ViewMeetingontent({ id }: Props) {
    const { data } = useSuspenseQuery<MeetingDetailResponse>({
        queryKey: ['meeting', id],
        queryFn: () => meetingsApi.getOneMeeting(id),
        retry: 2,
        staleTime: 2 * 60 * 1000, //Store in cache for 2 min
    });

    return (
        <>
            <div>
                <h2 className="">View Meeting</h2>
                {JSON.stringify(data)}
            </div>
        </>
    );
}

export default ViewMeetingontent;