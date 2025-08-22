import { Router, Request, Response } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import expressAsyncHandler from "express-async-handler";
import { and, eq, not } from "drizzle-orm";
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { db } from "../db";
import { agents, meetings } from "../db/schema";
import { streamVideo } from "../config/streamVideo";

const router = Router();

router.post('/', authMiddleware, expressAsyncHandler(async (req: Request, res: Response) => {
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
}));


function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}



export default router;