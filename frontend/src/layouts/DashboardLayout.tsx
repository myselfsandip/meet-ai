import DashboardSidebar from "@/layouts/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}


function DashboardLayout({ children }: Props) {
    return (
        <>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="flex flex-col h-screen w-screen bg-muted">

                    {children}
                </main>
            </SidebarProvider>
        </>
    );
}

export default DashboardLayout;