import ResponsiveDialog from "../ResponsiveDialog";


interface NewAgentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void;
}


function NewAgentDialog({ open, onOpenChange }: NewAgentDialogProps) {
    return (
        <ResponsiveDialog
            title="New Agent"
            description="Create a new Agent"
            open={open}
            onOpenChange={onOpenChange}
        >
            New Agent Form
        </ResponsiveDialog>
    );
}

export default NewAgentDialog;