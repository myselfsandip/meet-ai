import LogoutButton from "@/components/custom/LogoutButton";
import DashboardLayout from "@/layouts/DashboardLayout";


function Dashboard() {
    return (
        <DashboardLayout>
            Logged in As Person
            <LogoutButton />
        </DashboardLayout>
    );
}

export default Dashboard;