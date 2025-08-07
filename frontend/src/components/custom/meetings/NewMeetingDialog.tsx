import ResponsiveDialog from "@/components/custom/ResponsiveDialog";
import MeetingForm from "./MeetingForm";
import { useNavigate } from "react-router-dom";


interface NewMeetingDialog {
    open: boolean,
    onOpenChange: (open: boolean) => void;
}


function NewMeetingDialog({ open, onOpenChange }: NewMeetingDialog) {
    const navigate = useNavigate();
    return (
        <ResponsiveDialog
            title="New Meeting"
            description="Create a new Meeting"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    // navigate(`/meetings/${id}`);
                }}
                onCancel={() => onOpenChange(false)}
            />

        </ResponsiveDialog>
    );
}

export default NewMeetingDialog;