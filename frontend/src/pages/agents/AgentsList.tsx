import useAgents from "@/hooks/useAgents";

// This Component is Used to make sure Static Things are not in Suspense State
function AgentsList() {
    const { data } = useAgents();

    return (
        <div>
            {JSON.stringify(data?.data, null, 2)}
        </div>
    );
}

export default AgentsList;
