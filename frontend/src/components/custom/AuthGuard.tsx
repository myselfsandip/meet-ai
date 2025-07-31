import useAuth from "@/hooks/useAuth";
import { type ReactNode } from "react";
import CustomLoader from "./CustomLoader";

interface AuthGuardProps {
    children: ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <CustomLoader />
    }
    if (!isAuthenticated) {
        return null;
    }


    return (<>
        {children}
    </>
    );
}

export default AuthGuard;