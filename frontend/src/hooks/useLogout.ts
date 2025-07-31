import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogout = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearAuth();
            toast.success("Logged out successfully");
            navigate("/signin", { replace: true });
            window.location.reload(); //Force Reload so that Browser Cache is not used and gets access by browser back button 
        },
        onError: (error: any) => {
            const errorMessage =
            error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(errorMessage);
        },
    });

    return logoutMutation;
};