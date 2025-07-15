import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/services/authApi';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const refreshMutation = useMutation({
        mutationFn: authApi.refreshToken,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            toast.success('Google login successful!');
            navigate('/overview');
        },
        onError: (error: any) => {
            console.error('OAuth callback error:', error);
            toast.error('Google login failed. Please try again.');
            navigate('/signin');
        },
    });

    useEffect(() => {
        refreshMutation.mutate();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Completing Google sign in...</p>
            </div>
        </div>
    );
}