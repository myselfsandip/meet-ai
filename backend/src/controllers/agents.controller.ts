import { Request, Response } from 'express';
import { db } from "../db"
import { agents } from "../db/schema"
import asyncHandler from 'express-async-handler';
import { agentDBResponseSchema, agentsDBResponseArraySchema, agentsInsertSchema, agentsInsertType, agentsQuerySchema } from '../validations/agents';
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
    const [data] = await db.select().from(agents).where(and(eq(agents.id, agentId), eq(agents.userId, userId))).orderBy(desc(agents.createdAt)).limit(1);
    if (!data) {
        res.status(404).json({
            success: false,
            message: 'Agent Not Found'
        });
        return;
    }
    const parsedpayload = agentDBResponseSchema.safeParse(data);
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