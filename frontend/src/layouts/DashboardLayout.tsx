import DashboardSidebar from "@/layouts/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import DashboardNavbar from "./DashboardNavbar";

interface Props {
    children: ReactNode;
}


function DashboardLayout({ children }: Props) {
    return (
        <>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="flex flex-col h-screen w-screen bg-muted">
                    <DashboardNavbar />
                    {children}
                </main>
            </SidebarProvider>
        </>
    );
}

export default DashboardLayout;