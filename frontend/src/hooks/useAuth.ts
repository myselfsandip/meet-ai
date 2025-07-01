import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authApi } from '@/services/authApi';
import { useNavigate } from 'react-router-dom';
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
    const { user, setAuth, clearAuth, accessToken } = useAuthStore();
    const navigate = useNavigate();

    const [authState, setAuthState] = useState<AuthStateType>({
        isAuthenticated: !!user && !!accessToken,
        isLoading: true,
        user,
    });

    const { isLoading: isTokenLoading, data, error } = useQuery<AuthResponse, Error>({
        queryKey: ['authCheck'],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error('No access token');
            }
            try {
                return await authApi.verifyToken();
            } catch (verifyError) {
                try {
                    return await authApi.refreshToken();
                } catch (refreshError) {
                    throw refreshError;
                }
            }
        },
        retry: 0,
        enabled: true,
    });

    useEffect(() => {
        if (isTokenLoading) return;

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
            navigate('/signin', { replace: true });
        }
    }, [data, error, isTokenLoading, setAuth, clearAuth, navigate]);

    return {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading || isTokenLoading,
        user: authState.user,
    };
};

export default useAuth;