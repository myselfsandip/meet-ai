import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { meetingsApi } from "@/services/meetingsApi";
import CallUI from "./CallUI";


interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

function CallConnect({ meetingId, meetingName, userId, userName, userImage }: Props) {
    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();

    useEffect(() => {
        let _client: StreamVideoClient;
        const initClient = async () => {
            _client = new StreamVideoClient({
                apiKey: import.meta.env.VITE_STREAM_PUBLIC_VIDEO_API_KEY!,
            });
            const tokenProvider = async () => {
                const token = await meetingsApi.generateToken();
                return token;
            };
            await _client.connectUser(
                {
                    id: String(userId),
                    name: userName,
                    image: userImage,
                },
                tokenProvider,
            );
            setClient(_client);
        };
        initClient();

        return () => {
            if (_client) {
                _client.disconnectUser();
            }
            setClient(undefined);
        };
    }, [userId, userName, userImage]);

    useEffect(() => {
        if (!client) return;
        const _call = client.call('default', meetingId);
        _call.camera.disable();
        _call.microphone.disable();
        setCall(_call);

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        }
    }, [client, meetingId]);


    if (!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        )
    }


    return (
        <StreamVideo client={client}>
            <StreamCall call={call} >
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    );
}

export default CallConnect;