import { Request, Response } from 'express';
import { db } from "../db"
import { agents } from "../db/schema"
import asyncHandler from 'express-async-handler';
import { agentDBResponseSchema, agentsDBResponseArraySchema, agentsInsertSchema, agentsInsertType } from '../validations/agents';
import { ApiResponse } from '../types/api';
import { desc, eq } from 'drizzle-orm';

export const getAgents = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // await new Promise(resolve => setTimeout(resolve, 5000));  //Custom Delay
    const data = await db.select().from(agents);
    const parsedpayload = agentsDBResponseArraySchema.safeParse(data);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: (process.env.NODE_ENV === 'production' ? null : parsedpayload.error.errors?.map(e => e.message))
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Agents fetched successfully",
        data: parsedpayload.data
    });
});

export const getAgent = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // await new Promise(resolve => setTimeout(resolve, 5000));  //Custom Delay
    const {id : agentId} = req.params;
    const [data] = await db.select().from(agents).where(eq(agents.id,agentId)).orderBy(desc(agents.createdAt)).limit(1);
    if(!data){
        res.status(404).json({
            success:false,
            message: 'Agent Not Found'
        });
        return;
    }
    const parsedpayload = agentDBResponseSchema.safeParse(data);
    if (!parsedpayload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid Data",
            errors: (process.env.NODE_ENV === 'production' ? null : parsedpayload.error.errors?.map(e => e.message))
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
            message: parsedpayload.error.errors?.map(e => e.message)
        });
        return;
    }
    const { name, instructions }: agentsInsertType = req.body;
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