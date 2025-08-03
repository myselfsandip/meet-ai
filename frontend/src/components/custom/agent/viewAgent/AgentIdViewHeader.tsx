import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";


interface Props {
    agentId: string;
    agentName: string;
    onEdit: () => void
    onRemove: () => void
}

function AgentIdViewHeader({ agentId, agentName, onEdit, onRemove }: Props) {

    return (<div className="flex items-center justify-between mb-2">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild className="font-medium text-xl" >
                        <Link to="/agents">
                            My Agents
                        </Link>
                    </BreadcrumbLink >
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
                    <ChevronRightIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild className="font-medium text-xl text-foreground" >
                        <Link to={`/agents/${agentId}`}>
                            {agentName}
                        </Link>
                    </BreadcrumbLink >
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        {/* Without modal={false} , the dialog that this dropdown opens cause the website to get unclickable  */}
        <DropdownMenu modal={false}  >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" >
                    <MoreVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
                <DropdownMenuItem className="cursor-pointer" onClick={onEdit} >
                    <PencilIcon className="size-4 text-black" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onRemove} >
                    <TrashIcon className="size-4 text-black" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>);
}

export default AgentIdViewHeader;