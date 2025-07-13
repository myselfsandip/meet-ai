import ErrorState from "@/components/custom/ErrorState";
import LoadingState from "@/components/custom/LoadingState";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AgentsList from "./AgentsList";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import NewAgentDialog from "@/components/custom/agent/NewAgentDialog";

function AgentsContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (<>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div>
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Agent
                    </Button>
                </div>
            </div>
            <ErrorBoundary fallback={<ErrorState title="Error Loading Agents" description="Please try again later" />}>
                <Suspense fallback={<LoadingState title="Loading Agents" description="This may take a few seconds" />}>
                    <AgentsList />
                </Suspense>
            </ErrorBoundary>
        </div>
    </>)
}

export default AgentsContent;