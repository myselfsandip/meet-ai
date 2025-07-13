import z from "zod"

export const agentDBResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.number(),
    instructions: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const agentsDBResponseArraySchema = z.array(agentDBResponseSchema);
export type agentsDBResponseType = z.infer<typeof agentDBResponseSchema>;


export const agentsInsertSchema = z.object({
    name: z.string().min(1,{message: "Name is required"}),
    instructions: z.string().min(1,{message: "Instructions is required"})
});


export type agentsInsertType = z.infer<typeof agentsInsertSchema>;