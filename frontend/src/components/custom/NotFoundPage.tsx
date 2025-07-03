import { Search } from "lucide-react";

export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="text-center space-y-6">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-800/50 border border-gray-700">
                    <Search className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-white">404</h1>
                    <h2 className="text-xl text-gray-300">
                        Oops! Page not found
                    </h2>
                </div>
                <p className="text-gray-400 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
        </div>
    );
}