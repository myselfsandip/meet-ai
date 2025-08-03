import ViewAgentContent from "@/components/custom/agent/viewAgent/ViewAgentContent";
import ErrorState from "@/components/custom/ErrorState";
import LoadingState from "@/components/custom/LoadingState";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";



function ViewAgent() {
    const { id } = useParams<{ id?: string }>();

    if (!id) return <ErrorState title="Missing ID" description="No agent ID provided." />;

    return (
        <DashboardLayout>
            <ErrorBoundary fallback={<ErrorState title="Error" description="Something went wrong." />}>
                <Suspense fallback={<LoadingState title="Loading Agent" description="This may take a few seconds" />}>
                    <ViewAgentContent id={id} />
                </Suspense>
            </ErrorBoundary>
        </DashboardLayout>
    );
}

export default ViewAgent;