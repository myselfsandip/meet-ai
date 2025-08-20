import { meetingsApi } from "@/services/meetingsApi";
import type { MeetingDetailResponse } from "@/types/meetingsTypes";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import ErrorState from "@/components/custom/ErrorState";
import CallProvider from "./CallProvider";

interface Props {
    meetingId: string;
}

function CallView({ meetingId }: Props): ReactNode {
    const { data } = useSuspenseQuery<MeetingDetailResponse>({
        queryKey: ['meeting', meetingId],
        queryFn: () => meetingsApi.getOneMeeting(meetingId),
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    if (data.status === "completed") {
        return <div className="flex h-screen items-center justify-center" >
            <ErrorState
                title="Meeting has ended"
                description="You can no longer join this meeting"
            />
        </div>
    }

    return (
        <CallProvider meetingId={meetingId} meetingName={data.name} />
    )
}

export default CallView;