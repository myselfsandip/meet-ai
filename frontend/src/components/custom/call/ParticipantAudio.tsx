import { ParticipantsAudio, useCallStateHooks } from '@stream-io/video-react-sdk';

export const AudioRenderer = () => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    // The ParticipantsAudio component takes the list of participants 
    // and handles creating the <audio> elements for them.
    return <ParticipantsAudio participants={participants} />;
};
