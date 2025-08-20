import CallView from "@/components/custom/call/CallView";
import { meetingsApi } from "@/services/meetingsApi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
    params: Promise<{
        meetingId: string;
    }>
}

function Call() {
    const { meetingId } = useParams<{ meetingId: string }>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    if (!meetingId) {
        navigate('/meetings', { replace: true })
        return;
    }

    useEffect(() => {
        void queryClient.prefetchQuery({
            queryKey: ['meeting', meetingId],
            queryFn: () => meetingsApi.getOneMeeting(meetingId)
        })
    }, [meetingId, queryClient]);

    return (<div className="h-screen bg-black">
        <CallView meetingId={meetingId} />
    </div>);
}

export default Call;
