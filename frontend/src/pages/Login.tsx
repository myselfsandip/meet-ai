import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Chrome } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// Define the schema for form validation
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Zustand store for auth (create this in src/stores/authStore.ts)
interface AuthState {
    user: { id: string; name: string; email: string } | null;
    accessToken: string | null;
    setAuth: (user: { id: string; name: string; email: string }, accessToken: string) => void;
    clearAuth: () => void;
}

// API calls
const loginUser = async (data: LoginForm) => {
    const response = await axios.post('/api/auth/signin', data);
    return response.data;
};

const getAccessTokenFromRefresh = async () => {
    const response = await axios.get('/api/auth/refresh');
    return response.data;
};

export default function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            toast.success('Login successful!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    // Handle OAuth callback (for redirect from googleCallback)
    const refreshMutation = useMutation({
        mutationFn: getAccessTokenFromRefresh,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            toast.success('Google login successful!');
            navigate('/dashboard');
        },
        onError: () => {
            toast.error('Google login failed');
        },
    });

    // Handle Google OAuth
    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = import.meta.env.VITE_SERVER_URL + '/api/auth/google'; // Adjust to your backend Google OAuth route
    };

    // Form submission
    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    // Check for OAuth callback
    if (window.location.pathname === '/oauth-success') {
        refreshMutation.mutate();
    }

    console.log(import.meta.env.VITE_SERVER_URL + '/api/auth/google')


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Sign in to your account or use Google to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                {...register('password')}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogIn className="mr-2 h-4 w-4" />
                            )}
                            Sign In
                        </Button>
                    </form>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Chrome className="mr-2 h-4 w-4" />
                        )}
                        Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}