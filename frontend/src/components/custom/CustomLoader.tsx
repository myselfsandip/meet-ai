import { Loader2 } from "lucide-react";

function CustomLoader() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-white">
            {/* Simple elegant loader */}
            <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-grey-500 animate-spin" />
            </div>

            {/* Loading text */}
            <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
        </div>
    );
}

export default CustomLoader;