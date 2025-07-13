import LogoutButton from "@/components/custom/LogoutButton";

function DashboardContent() {
    return (
        <div className="flex flex-col px-4">
            <div className="mb-5">
                Home
            </div>
            Logged in As Person
            <LogoutButton />
        </div>
    );
}

export default DashboardContent;