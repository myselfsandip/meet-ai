import { z } from 'zod'

export const agentsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    instructions: z.string().min(1, { message: "Instructions are required" })
});


export const agentUpdateSchema = z.object({
    id: z.string().min(1, { message: "Agent ID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    instructions: z.string().min(1, { message: "Instructions are required" })
});


export type agentInsertFormData = z.infer<typeof agentsInsertSchema>;
export type agentUpdateFormData = z.infer<typeof agentUpdateSchema>;