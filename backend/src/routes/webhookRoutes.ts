import { Router, Request, Response } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import expressAsyncHandler from "express-async-handler";
import { and, eq, not } from "drizzle-orm";
import {
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { db } from "../db";
import { agents, meetings } from "../db/schema";
import { streamVideo } from "../config/streamVideo";

const router = Router();

router.post('/', expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("Incoming webhook:", req.headers, req.body);
    const signature: string = req.headers["x-signature"] as string;
    const apiKey = req.headers["x-api-key"];

    if (!signature || !apiKey) {
        res.status(400).json({
            success: false,
            message: 'Missing signature or API key'
        });
        return;
    }
    const body = await req.body;
    if (!verifySignatureWithSDK(body, signature)) {
        res.status(401).json({
            success: false,
            message: 'Invalid signature'
        })
    }
    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid JSON'
        })
        return;
    }

    const eventType = (payload as Record<string, unknown>)?.type;
    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            res.status(400).json({
                success: false,
                message: "Missing meetingId",
            });
            return;
        }

        const [existingMeeting] = await db.select().from(meetings).where(
            and(
                eq(meetings.id, meetingId),
                not(eq(meetings.status, "completed")),
                not(eq(meetings.status, "active")),
                not(eq(meetings.status, "cancelled")),
                not(eq(meetings.status, "processing")),
            )
        );

        if (!existingMeeting) {
            res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
            return;
        }

        await db.update(meetings).set({
            status: "active",
            startedAt: new Date(),
        }).where(eq(meetings.id, existingMeeting.id));

        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            res.status(404).json({
                success: false,
                message: "Agent not found",
            });
            return;
        }

        const call = streamVideo.video.call("default", meetingId);

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPEN_AI_API_KEY!,
            agentUserId: existingAgent.id
        });

        realtimeClient.updateSession({
            instructions: existingAgent.instructions
        });
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            res.status(400).json({
                success: false,
                message: "Missing meetingId",
            });
            return;
        }
        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }
    res.json({
        status: "ok"
    });
}));


function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}



export default router;