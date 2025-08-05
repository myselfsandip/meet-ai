import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authApi } from '@/services/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AuthResponse } from '@/types/auth';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthStateType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

const useAuth = () => {
    const { user, setAuth, clearAuth, accessToken, hasHydrated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [authState, setAuthState] = useState<AuthStateType>({
        isAuthenticated: !!user && !!accessToken,
        isLoading: !hasHydrated,
        user
    });

    const { isLoading: isTokenLoading, data, error } = useQuery<AuthResponse, Error>({
        queryKey: ['authCheck'],
        queryFn: async () => {
            if (!accessToken) {
                // console.log('no access token , refresh happened')
                return await authApi.refreshToken();
            }
            try {
                return await authApi.me();
            } catch (verifyError) {
                try {
                    return await authApi.refreshToken();
                } catch (refreshError) {
                    throw refreshError;
                }
            }
        },
        retry: 0,
        enabled: !!hasHydrated,
        staleTime: 5 * 60 * 1000
    });

    useEffect(() => {
        if (isTokenLoading || !hasHydrated) return;

        if (data) {
            setAuth(data.user, data.token);
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: data.user,
            });
        } else if (error) {
            clearAuth();
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
            });
            if (location.pathname !== '/signin' && location.pathname !== '/signup') {
                navigate('/signin', { replace: true, state: { from: location.pathname, reason: 'unauthorized' } });
            };
        }
    }, [data, error, isTokenLoading, hasHydrated, setAuth, clearAuth, navigate, location.pathname]);

    return {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading || isTokenLoading || !hasHydrated,
        user: authState.user,
    };
};

export default useAuth;