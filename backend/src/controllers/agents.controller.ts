import { Request, Response } from 'express';
import { db } from "../db"
import { agents } from "../db/schema"
import asyncHandler from 'express-async-handler';
import {
    agentDeleteSchema, agentsDBResponseArraySchema, agentsDeleteType, agentsDeleteUpdateType,
    agentsInsertSchema, agentsInsertType, agentsQuerySchema, agentUpdateSchema, agentWithMeetingCountSchema
} from '../validations/agents';
import { ApiResponse } from '../types/api';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import { formatZodErrors } from '../utils/formatZodError';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/constants';

export const getAgents = asyncHandler(async (req: Request, res: Response) => {
    // await new Promise(resolve => setTimeout(resolve, 5000));  //Custom Delay
    const userId = (req as any).user.userId;
    const queryValidation = agentsQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: formatZodErrors(queryValidation.error)
        });
    }

    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search } = queryValidation.data ?? {};

    const whereClause = and(
        eq(agents.userId, userId),
        search ? ilike(agents.name, `%${search}%`) : undefined
    );

    const data = await db.select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`,
    }).from(agents).
        where(whereClause).
        orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

    const [total] = await db.select({
        count: count()
    }).from(agents).where(whereClause);

    const totalPages = Math.ceil(total.count / pageSize);

    const parsedpayload = agentsDBResponseArraySchema.safeParse(data);
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
        message: "Agents fetched successfully",
        data: parsedpayload.data,
        total: total.count,
        totalPages
    });
});

export const getOneAgent = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id: agentId } = req.params;
    const userId = (req as any).user.userId;
    const [data] = await db.select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`,
    }).from(agents).where(and(eq(agents.id, agentId), eq(agents.userId, userId))).orderBy(desc(agents.createdAt)).limit(1);
    if (!data) {
        res.status(404).json({
            success: false,
            message: 'Agent Not Found'
        });
        return;
    }
    const parsedpayload = agentWithMeetingCountSchema.safeParse(data);
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
        message: "Agents fetched successfully",
        data: parsedpayload.data
    });
});

export const createAgent = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const parsedpayload = agentsInsertSchema.safeParse(req.body);

    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: parsedpayload.error.flatten().fieldErrors
        });
        return;
    }
    const { name, instructions }: agentsInsertType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const [data] = await db.insert(agents).values({
        name,
        userId,
        instructions
    }).returning();

    res.status(200).json({
        success: true,
        message: "Agent Created Successfully",
        data: data
    });
});


export const updateAgent = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const parsedpayload = agentUpdateSchema.safeParse(req.body);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: parsedpayload.error.flatten().fieldErrors
        });
        return;
    }
    const { id, name, instructions }: agentsDeleteUpdateType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const updateAgentRes = await db.update(agents).
        set({
            name, instructions,
            updatedAt: new Date()
        }).where(
            and(eq(agents.id, id),
                eq(agents.userId, userId)))
        .returning();
    if (updateAgentRes.length === 0) {
        res.status(404).json({
            success: false,
            message: "Agent not found"
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: `Agent ${updateAgentRes[0].name} Updated Successfully`,
        data: updateAgentRes[0]
    });
});

export const deleteAgent = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id: agentId } = req.params;
    const parsedpayload = agentDeleteSchema.safeParse({ id: agentId });
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            errors: formatZodErrors(parsedpayload.error)
        });
        return;
    }
    const { id }: agentsDeleteType = parsedpayload.data;
    const userId = (req as any).user.userId;
    const delAgentRes = await db.delete(agents).where(and(eq(agents.id, id), eq(agents.userId, userId))).returning();
    if (delAgentRes.length === 0) {
        res.status(404).json({
            success: false,
            message: "Agent not found"
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: `Agent ${delAgentRes[0].name} deleted successfully`,
        data: delAgentRes[0]
    });
});