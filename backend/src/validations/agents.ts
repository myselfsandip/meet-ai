import { z, union } from "zod"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "../utils/constants";

export const agentDBResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.number(),
    instructions: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const agentWithMeetingCountSchema = agentDBResponseSchema.extend({
    meetingCount: union([
        z.number(),
        z.string().transform(val => Number(val))
    ])
})

export const agentsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    instructions: z.string().min(1, { message: "Instructions is required" }).trim()
});

export const agentspaginationSchema = z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE)
})

export const agentsQuerySchema = agentspaginationSchema.extend({
    search: z.string().nullish()
}).optional()


export const agentsDBResponseArraySchema = z.array(agentWithMeetingCountSchema);
export type agentsDBResponseType = z.infer<typeof agentDBResponseSchema>;
export type agentsInsertType = z.infer<typeof agentsInsertSchema>;
export type agentsQueryType = z.infer<typeof agentsQuerySchema>;