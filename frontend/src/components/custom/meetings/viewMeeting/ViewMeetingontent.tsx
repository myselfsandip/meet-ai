import { meetingsApi } from "@/services/meetingsApi";
import type { MeetingDetailResponse, MeetingsFilters, MeetingsListResponse } from "@/types/meetingsTypes";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdViewHeader from "./MeetingIdViewHeader";
import { useConfirm } from "@/hooks/useConfirm";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PAGE } from "@/utils/constants";
import { toast } from "sonner";
import UpdateMeetingDialog from "../UpdateMeetingDialog";
import { useState } from "react";
import UpcomingState from "../UpcomingState";
import ActiveState from "../ActiveState";
import CancelledState from "../CancelledState";
import ProcessingState from "../ProcessingState";

interface Props {
    meetingId: string
}

function ViewMeetingontent({ meetingId }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data } = useSuspenseQuery<MeetingDetailResponse>({
        queryKey: ['meeting', meetingId],
        queryFn: () => meetingsApi.getOneMeeting(meetingId),
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    const { confirm, ConfirmDialog } = useConfirm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const filters = { search: '', page: DEFAULT_PAGE };

    const handleRemove = async () => {
        const confirmed = await confirm({
            title: "Are you sure?",
            description: `The following action will remove this meeting`,
            confirmText: "Delete Meeting",
            cancelText: "Cancel",
            variant: "destructive"
        });

        if (confirmed) {
            deleteMutation.mutate(data.id);
        }
    }

    const deleteMutation = useMutation({
        mutationFn: meetingsApi.deleteMeeting,
        onSuccess: (data) => {
            toast.success(`Meeting ${data.name} Deleted Successfully`);
            queryClient.invalidateQueries({ queryKey: ['meetings', filters] });
            queryClient.prefetchQuery<MeetingsListResponse, Error, MeetingsListResponse, [string, MeetingsFilters]>({
                queryKey: ['meetings', filters],
                queryFn: ({ queryKey }) => {
                    const [_key, filters] = queryKey;
                    return meetingsApi.getMeetings(filters)
                }
            })
            navigate('/meetings');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to Delete Meeting. Please try again.';
            toast.error(errorMessage);
        },
    });

    const isActive = data.status === 'active';
    const isUpcoming = data.status === 'upcoming';
    const isCancelled = data.status === 'cancelled';
    const isCompleted = data.status === 'completed';
    const isProcessing = data.status === 'processing';

    return (
        <>
            <UpdateMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} MeetingData={data} />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4" >
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setIsDialogOpen(true)}
                    onRemove={handleRemove}
                />
                {isCancelled && <CancelledState />}
                {isProcessing && <ProcessingState />}
                {isCompleted && <div>Completed</div>}
                {isActive && <ActiveState meetingId={meetingId} onCancelMeeting={() => { }} isCancelling={false} />}
                {isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={() => { }} isCancelling={false} />}
            </div>
            <ConfirmDialog />
        </>
    );
}

export default ViewMeetingontent;