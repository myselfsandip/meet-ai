import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { GenerateAvatarUri } from "@/lib/Avatar";
import { DefaultVideoPlaceholder, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview, type StreamVideoParticipant } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { user } = useAuth();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: user?.name ?? "",
                    image: user?.image ?? GenerateAvatarUri({ seed: user?.name ?? "", variant: "initials" })
                } as StreamVideoParticipant
            }
        />
    )
}

const AllowBroserPermissions = () => {
    return (
        <p className="text-sm">
            Please grant your browser a permission to access your camera and microphone.
        </p>
    )
}

function CallLobby({ onJoin }: Props) {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

    return (<div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar" >
        <div className="py-4 px-8 flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                <div className="flex flex-col gap-y-2 text-center">
                    <h6 className="text-lg font-medium">Ready to join?</h6>
                    <p className="text-sm">Set up your call before joining</p>
                </div>
                <VideoPreview
                    DisabledVideoPreview={
                        hasBrowserMediaPermission ? DisabledVideoPreview : AllowBroserPermissions
                    }
                />

                <div className="flex gap-x-2">
                    <ToggleAudioPreviewButton />
                    <ToggleVideoPreviewButton />
                </div>
                <div className="flex gap-x-2 justify-between w-full">
                    <Button asChild variant="ghost">
                        <Link to="/meetings">Cancel</Link>
                    </Button>
                    <Button onClick={onJoin} >
                        <LogInIcon />
                        Join Call
                    </Button>
                </div>
            </div>
        </div>
    </div>);
}

export default CallLobby;