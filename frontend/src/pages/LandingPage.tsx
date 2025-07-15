import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
    return (<div className="h-screen w-screen flex justify-center items-center text-5xl text-green-500 font-bold">
        <div className="flex flex-col gap-8">
            Landing Page

            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            <Button onClick={() => navigate('/signin')}>Sign In</Button>
            <Button onClick={() => navigate('/overview')}>Dashboard</Button>
        </div>
    </div>);
}

export default LandingPage;