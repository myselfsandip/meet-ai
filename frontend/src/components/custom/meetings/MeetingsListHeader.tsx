import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import NewMeetingDialog from "./NewMeetingDialog";
import { MeetingsSearchFilter } from "./MeetingsSearchFilter";
import { StatusFilter } from "./StatusFilter";
import AgentIdFilter from "./AgentIdFilter";
import { useMeetingsFilters } from "@/hooks/useMeetingsFilters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


function MeetingsListHeader() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useMeetingsFilters();

    const isAnyFiltersModified: boolean = (!!filters.status || !!filters.search || !!filters.agentId);

    const onClearFilters = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: 1,
        })
    }



    return (
        <>
            <NewMeetingDialog onOpenChange={setIsDialogOpen} open={isDialogOpen} />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>


                <ScrollArea> 
                    <div className="flex items-center gap-x-2 p-1 ">
                        <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter />
                        {
                            isAnyFiltersModified && (
                                <Button variant="outline" onClick={onClearFilters} >
                                    <XCircleIcon className="size-4" />
                                    Clear
                                </Button>
                            )
                        }
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );
}

export default MeetingsListHeader;