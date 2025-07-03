import { Loader2 } from "lucide-react";

function CustomLoader() {
    return (<div className="h-screen w-screen flex flex-col justify-center items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>);
}

export default CustomLoader;