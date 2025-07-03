import { BotIcon, LayoutDashboard, StarIcon, VideoIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "../components/ui/separator";
import { cn } from "@/lib/utils";
import DashboardUserButton from "../components/custom/DashboardUserButton";



function DashboardSidebar() {
    const location = useLocation();
    const pathname = location.pathname;



    const firstSection = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/dashboard"
        },
        {
            icon: VideoIcon,
            label: "Meetings",
            href: "/meetings"
        }, {
            icon: BotIcon,
            label: "Agents",
            href: "/agents"
        }
    ];

    const secondSection = [
        {
            icon: StarIcon,
            label: "Upgrade",
            href: "/upgrade"
        }
    ];


    return (<Sidebar>
        <SidebarHeader className="text-sidebar-accent-foreground">
            <Link to="/" className="flex items-center gap-2 px-2 pt-2">
                <img src="logo.svg" alt="image" className="h-9 w-9 object-contain" />
                <p className="text-2xl font-semibold">Meet.AI</p>
            </Link>
        </SidebarHeader>
        <div className="px-4 py-2">
            <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {firstSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                    )}>
                                    <Link to={item.href}>
                                        <item.icon className="size-5" />
                                        <span className="text-sm font-medium tracking-tight">
                                            {item.label}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]" />
            </div>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {secondSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                    )}>
                                    <Link to={item.href}>
                                        <item.icon className="size-5" />
                                        <span className="text-sm font-medium tracking-tight">
                                            {item.label}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>


        </SidebarContent>
        <SidebarFooter className="text-white">
            <DashboardUserButton />
        </SidebarFooter>
    </Sidebar>);
}

export default DashboardSidebar;