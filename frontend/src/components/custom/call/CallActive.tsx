import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import { Link } from "react-router-dom";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

function CallActive({ onLeave, meetingName }: Props) {
    return (<div className="flex flex-col justify-between p-4 h-full text-white">
        <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4 " >
            <Link to="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                <img src="/logo.svg" height={22} width={22} alt="Image" />
            </Link>
            <h4 className="text-base">{meetingName}</h4>
        </div>
        <SpeakerLayout />
        <div className="bg-[#101213] rounded-full px-4">
            <CallControls onLeave={onLeave} />
        </div>
    </div>);
}

export default CallActive;