import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "../ErrorState";
import LoadingState from "../LoadingState";
import MeetingsList from "./MeetingsList";
import MeetingsListHeader from "./MeetingsListHeader";
import { Suspense } from "react";




function MeetingsContent() {

    return (
        <>
            <MeetingsListHeader />
            <ErrorBoundary fallback={<ErrorState title="Error" description="Something went wrong." />}>
                <Suspense fallback={<LoadingState title="Loading Meetings" description="This may take a few seconds" />}>
                    <MeetingsList />
                </Suspense>
            </ErrorBoundary>
        </>

    );
}
export default MeetingsContent;