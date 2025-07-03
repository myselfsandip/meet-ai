import useAuth from "@/hooks/useAuth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CustomLoader from "./CustomLoader";

interface AuthGuardProps {
    children: ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            console.log('Page Redirecting...');
            navigate('/signin', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return <CustomLoader />
    }
    return (<>
        {children}
    </>
    );
}

export default AuthGuard;