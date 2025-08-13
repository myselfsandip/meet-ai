import ErrorState from "@/components/custom/ErrorState";
import LoadingState from "@/components/custom/LoadingState";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AgentsList from "./AgentsList";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import NewAgentDialog from "@/components/custom/agent/NewAgentDialog";
import { useFilters } from "@/hooks/useFilters";
import { AgentsSerachFilter } from "@/components/custom/agent/AgentsSearchFilter";
import { DEFAULT_PAGE } from "@/utils/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function AgentsContent() {
    const [filters, setFilters] = useFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE
        });
    }


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

                <ScrollArea>
                    <div className="flex items-center gap-x-2 p-1 ">
                        <AgentsSerachFilter />
                        {isAnyFilterModified && (
                            <Button variant="outline" size="sm" onClick={onClearFilters}>
                                <XCircleIcon />
                                Clear
                            </Button>
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
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