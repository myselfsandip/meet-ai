import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";

export default function LogoutButton() {
    const logoutMutation = useLogout();

    return (
        <Button onClick={() => logoutMutation.mutate()}>
            Logout
        </Button>
    );
}