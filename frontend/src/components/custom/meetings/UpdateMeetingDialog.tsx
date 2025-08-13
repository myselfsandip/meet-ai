import type { MeetingModel } from "@/types/meetingsTypes";
import ResponsiveDialog from "../ResponsiveDialog";
import MeetingForm from "./MeetingForm";

interface UpdateMeetingDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    MeetingData: MeetingModel
}

function UpdateMeetingDialog({ open, onOpenChange, MeetingData }: UpdateMeetingDialogProps) {
    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit the meeting details"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                initialValues={MeetingData}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
}

export default UpdateMeetingDialog;