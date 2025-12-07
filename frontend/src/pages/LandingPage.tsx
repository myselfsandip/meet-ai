import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/signin');
    }, [navigate]);

    return null; // <--- ADD THIS
}

export default LandingPage;
