// src/pages/SignIn.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/services/authApi';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import AuthLayout from '@/layouts/AuthLayout';

export default function SignIn() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.signin,
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            toast.success('Welcome back!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        },
    });

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        try {
            const googleAuthUrl = authApi.getGoogleAuthUrl();
            window.location.href = googleAuthUrl;
        } catch (error) {
            setIsGoogleLoading(false);
            toast.error('Failed to initiate Google login');
        }
    };

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <AuthLayout

            title='Welcome Back'
            description='Sign in to your account to continue'
        >

            {/* Children Prop */}
            <div>
                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={loginMutation.isPending}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...register('password')}
                                className={errors.password ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                                disabled={loginMutation.isPending}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loginMutation.isPending}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending || isGoogleLoading}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In
                            </>
                        )}
                    </Button>

                </form>

                {/* Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>

                {/* Google Login Button */}
                <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || loginMutation.isPending}
                >
                    {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Chrome className="mr-2 h-4 w-4" />
                    )}
                    Continue with Google
                </Button>
            </div>


            {/* Footer Prop */}
            <div>
                <p className="text-sm text-muted-foreground text-center">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout >
    );
}