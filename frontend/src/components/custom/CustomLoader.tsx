import { LoaderIcon } from "lucide-react";

function CustomLoader() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-white">
            {/* Simple elegant loader */}
            <div className="flex items-center justify-center">
                <LoaderIcon className="size-6 animate-spin" />
            </div>

        </div>
    );
}

export default CustomLoader;

// import { LoaderIcon } from "lucide-react";

// function CustomLoader() {
//     return (
//         <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
//             <LoaderIcon className="size-6 animate-spin text-white" />
//         </div >
//     );
// }

// export default CustomLoader;