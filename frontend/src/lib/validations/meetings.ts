import { z } from 'zod'

export const meetingStatusEnum = z.enum(["upcoming", "active", "completed", "processing", "cancelled"]);
export type MeetingStatus = z.infer<typeof meetingStatusEnum>;

export const meetingInsertSchema = z.object({
    name: z.string().min(1, { message: "Meeting name is required" }).trim(),
    agentId: z.string().min(1, { message: "Agent is required" }),
    // status: meetingStatusEnum.optional(),
    // startedAt: z.string().datetime().optional().nullable(),
    // endedAt: z.string().datetime().optional().nullable(),
    // transcriptUrl: z.string().url({ message: "Invalid URL" }).optional().nullable(),
    // recordingUrl: z.string().url({ message: "Invalid URL" }).optional().nullable(),
    // summary: z.string().optional().nullable(),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
    id: z.string().min(1, { message: "Id is required" })
});

export type meetingInsertFormData = z.infer<typeof meetingInsertSchema>;
export type meetingUpdateFormData = z.infer<typeof meetingUpdateSchema>;
