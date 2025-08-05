import ErrorState from "@/components/custom/ErrorState";
import LoadingState from "@/components/custom/LoadingState";
import ViewMeetingontent from "@/components/custom/meetings/viewMeeting/ViewMeetingontent";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";

function ViewMeeting() {
    const { id } = useParams<{ id: string }>();
    if (!id) return <ErrorState title="Missing ID" description="No agent ID provided." />;

    return (
        <DashboardLayout>
            <ErrorBoundary fallback={<ErrorState title="Error" description="Something went wrong." />}>
                <Suspense fallback={<LoadingState title="Loading Agent" description="This may take a few seconds" />}>
                    <ViewMeetingontent id={id} />
                </Suspense>
            </ErrorBoundary>
        </DashboardLayout>
    );
}

export default ViewMeeting;