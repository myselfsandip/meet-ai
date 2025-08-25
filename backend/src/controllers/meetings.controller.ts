import { Request, Response } from 'express';
import { db } from "../db"
import { agents, meetings, users } from "../db/schema"
import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../types/api';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import { formatZodErrors } from '../utils/formatZodError';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/constants';
import {
    meetingDeleteSchema, MeetingDeleteType, meetingInsertSchema, MeetingInsertType,
    meetingSchema, meetingsDBResponseArraySchema, meetingsQuerySchema,
    meetingUpdateSchema, MeetingUpdateType
} from '../validations/meetings';
import { streamVideo } from '../config/streamVideo';
import { generateAvatarUri } from '../utils/avatar';

export const getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const queryValidation = meetingsQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: formatZodErrors(queryValidation.error)
        });
    }

    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search, status, agentId } = queryValidation.data ?? {};

    const whereClause = and(
        eq(meetings.userId, userId),
        search ? ilike(meetings.name, `%${search}%`) : undefined,
        status ? eq(meetings.status, status) : undefined,
        agentId ? eq(meetings.agentId, agentId) : undefined,
    );

    const data = await db.select({
        ...getTableColumns(meetings),
        agent: agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
    }).from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause).
        orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

    const [total] = await db.select({
        count: count()
    }).from(meetings).where(whereClause);

    const totalPages = Math.ceil(total.count / pageSize);

    const parsedpayload = meetingsDBResponseArraySchema.safeParse(data);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: formatZodErrors(parsedpayload.error)
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Meetings fetched successfully",
        data: parsedpayload.data,
        total: total.count,
        totalPages
    });
});

export const getOneMeeting = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const [data] = await db.select({
        ...getTableColumns(meetings),
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
    }).from(meetings).where(and(eq(meetings.id, id), eq(meetings.userId, userId))).orderBy(desc(meetings.createdAt)).limit(1);
    if (!data) {
        res.status(404).json({
            success: false,
            message: 'Meeting Not Found'
        });
        return;
    }
    const parsedpayload = meetingSchema.safeParse(data);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: formatZodErrors(parsedpayload.error)
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Meeting fetched successfully",
        data: parsedpayload.data
    });
});

export const createMeeting = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const parsedpayload = meetingInsertSchema.safeParse(req.body);

    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: parsedpayload.error.flatten().fieldErrors
        });
        return;
    }
    const input: MeetingInsertType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const [createdMeeting] = await db.insert(meetings).values({
        ...input,
        userId: userId
    }).returning();

    const call = streamVideo.video.call("default", createdMeeting.id);
    await call.create({
        data: {
            created_by_id: String(userId),
            custom: {
                meetingId: createdMeeting.id,
                meetingName: createdMeeting.name
            },
            settings_override: {
                transcription: {
                    language: "en",
                    mode: "auto-on",
                    closed_caption_mode: "auto-on"
                },
                recording: {
                    mode: "auto-on",
                    quality: "1080p"
                }
            }
        }
    });

    //Fetch the Agent that this newly created meeting uses
    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, createdMeeting.agentId));

    if (!existingAgent) {
        res.status(400).json({
            success: false,
            message: 'Agent Not Found!!'
        })
    }

    await streamVideo.upsertUsers([
        {
            id: existingAgent.id,
            name: existingAgent.name,
            role: 'user',
            image: await generateAvatarUri({ seed: existingAgent.name, variant: 'botttsNeutral' })
        }
    ])

    res.status(200).json({
        success: true,
        message: "Meeting Created Successfully",
        data: createdMeeting
    });
});

export const updateMeeting = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const parsedpayload = meetingUpdateSchema.safeParse(req.body);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: parsedpayload.error.flatten().fieldErrors
        });
        return;
    }
    const input: MeetingUpdateType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const updateMeetingRes = await db.update(meetings).
        set({
            ...input,
            updatedAt: new Date()
        }).where(
            and(eq(meetings.id, input.id),
                eq(meetings.userId, userId)))
        .returning();
    if (updateMeetingRes.length === 0) {
        res.status(404).json({
            success: false,
            message: "Meeting not found"
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: `Meeting ${updateMeetingRes[0].name} Updated Successfully`,
        data: updateMeetingRes[0]
    });
});

export const deleteMeeting = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id: agentId } = req.params;
    const parsedpayload = meetingDeleteSchema.safeParse({ id: agentId });
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: formatZodErrors(parsedpayload.error)
        });
        return;
    }
    const { id }: MeetingDeleteType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const delMeetingRes = await db.delete(meetings).where(and(eq(meetings.id, id), eq(meetings.userId, userId))).returning();
    if (delMeetingRes.length === 0) {
        res.status(404).json({
            success: false,
            message: "Meeting not found"
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: `Agent ${delMeetingRes[0].name} deleted successfully`,
        data: delMeetingRes[0]
    });
});


export const generateToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const userIdStr = String(userId);
    await streamVideo.upsertUsers([
        {
            id: userIdStr,
            name: user.name!,
            role: 'admin',
            image: user.image ?? await generateAvatarUri({ seed: user.name!, variant: "initials" })
        }
    ]);
    const token = streamVideo.generateUserToken({ user_id: userIdStr });
    res.status(200).json({
        success: true,
        message: "Token generated successfully",
        token: token
    })
})