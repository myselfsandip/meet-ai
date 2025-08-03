import { agentsApi } from "@/services/agentsApi";
import type { AgentDetailResponse, AgentsFilters, AgentsListResponse } from "@/types/agentsTypes";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import AgentIdViewHeader from "@/components/custom/agent/viewAgent/AgentIdViewHeader";
import GeneratedAvatar from "../../GeneratedAvatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useConfirm } from "@/hooks/useConfirm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PAGE } from "@/utils/constants";
import UpdateAgentDialog from "../UpdateAgentDialog";
import { useState } from "react";

interface Props {
    id: string
}

function ViewAgentContent({ id }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: { data } } = useSuspenseQuery<AgentDetailResponse>({
        queryKey: ['agent', id],
        queryFn: () => agentsApi.getOneAgent(id),
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
    const { confirm, ConfirmDialog } = useConfirm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const filters = { search: '', page: DEFAULT_PAGE };



    const handleRemove = async () => {
        const confirmed = await confirm({
            title: "Delete Agent",
            description: `The following action will remove ${data.meetingCount} associated ${data.meetingCount > 1 ? 'meetings' : 'meeting'}`,
            confirmText: "Delete Agent",
            cancelText: "Cancel",
            variant: "destructive"
        });

        if (confirmed) {
            deleteMutation.mutate(data.id);
        }
    }

    const deleteMutation = useMutation({
        mutationFn: agentsApi.deleteAgent,
        onSuccess: (data) => {
            toast.success(`Agent ${data.name} Deleted Successfully`);
            queryClient.invalidateQueries({ queryKey: ['agents', filters] });
            queryClient.prefetchQuery<AgentsListResponse, Error, AgentsListResponse, [string, AgentsFilters]>({
                queryKey: ['agents', filters],
                queryFn: ({ queryKey }) => {
                    const [_key, filters] = queryKey;
                    return agentsApi.getAgents(filters)
                }
            })
            navigate('/agents');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to Delete Agent. Please try again.';
            toast.error(errorMessage);
        },
    });

    return <>
        <UpdateAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} agentData={data} />
        <AgentIdViewHeader
            agentId={data.id}
            agentName={data.name}
            onEdit={() => setIsDialogOpen(true)}
            onRemove={handleRemove}
        />

        <div className="bg-white rounded-lg border" >
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5" >
                <div className="flex items-center gap-x-3" >
                    <GeneratedAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
                    <h2 className="text-2xl font-medium" >{data.name}</h2>
                </div>
                <Badge
                    variant="outline"
                    className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                    <VideoIcon className="text-blue-700" />
                    {data.meetingCount}  {data.meetingCount === 1 ? "meeting" : "meetings"}
                </Badge>

                <div className="flex flex-col gap-y-4" >
                    <p className="text-lg font-medium" >Instructions</p>
                    <p className="text-neutral-800" > {data.instructions} </p>
                </div>
            </div>
        </div>
        <ConfirmDialog />
    </>;
}

export default ViewAgentContent;