import type { AgentGetOneResponse } from "@/types/agentsTypes";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOneResponse;
}


function AgentForm() {
    return ( <div>
        Agent Form
    </div> );
}

export default AgentForm;