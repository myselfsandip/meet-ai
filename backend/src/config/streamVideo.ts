import { StreamClient } from "@stream-io/node-sdk";

export const streamVideo = new StreamClient(
    process.env.STREAM_PUBLIC_VIDEO_API_KEY!,
    process.env.STREAM_VIDEO_SECRET_KEY!,
    { timeout: 3000 }
);