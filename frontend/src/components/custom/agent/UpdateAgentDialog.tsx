import type { AgentModel } from "@/types/agentsTypes";
import ResponsiveDialog from "../ResponsiveDialog";
import AgentForm from "./AgentForm";


interface UpdateAgentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    agentData: AgentModel
}


function UpdateAgentDialog({ open, onOpenChange, agentData }: UpdateAgentDialogProps) {
    return (
        <ResponsiveDialog
            title="Edit Agent"
            description="Edit the agent details"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={agentData}
            />
        </ResponsiveDialog>
    );
}

export default UpdateAgentDialog;