import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/AuthLayout";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChromeIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SignUp() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [OAuthLoading, setOAuthLoading] = useState(false);


    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });


    const signUpMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data: any) => {
            const token = data.accessToken || data.token || "";
            setAuth(data.user, token);
            toast('Welcome!');
            navigate('/overview');
        },
        onError: (err) => {
            const errorMessage = err.message ? err.message : 'Sign Up failed. Please try again.';
            toast(errorMessage);
        }
    })


    const onsubmit = (data: SignupFormData) => {
        signUpMutation.mutate(data);
    }

    const handleGoogleLogin = () => {
        setOAuthLoading(true);
        try {
            const googleAuthUrl = authApi.getGoogleAuthUrl();
            window.location.href = googleAuthUrl;
        } catch (error) {
            setOAuthLoading(false);
            toast.error('Failed to initiate Google login');
        }
    }


    return (
        <AuthLayout title="Sign Up" description="Create an account to continue">
            <div>
                <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <Label htmlFor="emnameail">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter Your Name"
                            {...register}
                            className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={signUpMutation.isPending}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter Your Email"
                            {...register}
                            className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={signUpMutation.isPending}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                {...register}
                                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={signUpMutation.isPending}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                id="confirmPassword"
                                {...register}
                                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={signUpMutation.isPending}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button type="submit"
                        className="w-full"
                        disabled={signUpMutation.isPending}
                    >
                        {
                            signUpMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 'Signing Up...'</> : 'Sign Up'
                        }
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
            </div>

            <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleGoogleLogin}
            >
                < ChromeIcon className="mr-2" />  {
                    OAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue With Google'
                }

            </Button>

            <div>
                <p className="text-sm text-muted-foreground text-center">
                    Have an Account ?{'  '}
                    <Link to="/signin" className="text-blue-500 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default SignUp;