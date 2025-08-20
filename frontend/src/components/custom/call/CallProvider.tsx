import { LoaderIcon } from "lucide-react";
import { GenerateAvatarUri } from "@/lib/Avatar";
import useAuth from "@/hooks/useAuth";
import CallConnect from "./CallConnect";

interface Props {
    meetingId: string;
    meetingName: string;
}

function CallProvider({ meetingId, meetingName }: Props) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (!isAuthenticated || isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        )
    }

    return <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={user?.id}
        userName={user.name}
        userImage={user.image ??
            GenerateAvatarUri({ seed: user.name, variant: 'initials' })
        }
    />
}

export default CallProvider;