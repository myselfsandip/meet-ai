import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from "react";



export interface AuthLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode
}



function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">{children}</CardContent>

                {footer && <CardFooter className="justify-center">
                    {footer}
                </CardFooter>}
            </Card>
        </div>
    );
}

export default AuthLayout;