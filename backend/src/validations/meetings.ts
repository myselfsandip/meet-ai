import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "../utils/constants";

export const meetingStatusEnum = z.enum([
    "upcoming",
    "active",
    "completed",
    "processing",
    "cancelled"
]);

export const meetingInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    agentId: z.string().min(1, { message: "Agent ID is required" }).trim(),
    status: meetingStatusEnum.optional(),
    startedAt: z.coerce.date().optional().nullable(),
    endedAt: z.coerce.date().optional().nullable(),
    transcriptUrl: z.string().url().optional().nullable(),
    recordingUrl: z.string().url().optional().nullable(),
    summary: z.string().optional().nullable(),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
    id: z.string().min(1, { message: "Meeting ID is required" }).trim(),
});

export const meetingDeleteSchema = z.object({
    id: z.string().min(1, { message: "Meeting ID is required" }).trim(),
});

export const meetingPaginationSchema = z.object({
    page: z.coerce.number().min(1).default(DEFAULT_PAGE),
    pageSize: z.coerce.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export const meetingsQuerySchema = meetingPaginationSchema.extend({
    search: z.string().nullish(),
}).optional();

export const meetingSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.number(),
    agentId: z.string(),
    status: meetingStatusEnum,
    startedAt: z.date().nullable(),
    endedAt: z.date().nullable(),
    transcriptUrl: z.string().nullable(),
    recordingUrl: z.string().nullable(),
    summary: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});



export const enrichedMeetingSchema = meetingSchema.extend({
    duration: z.number().nullable(),
    agent: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

export const meetingsDBResponseArraySchema = z.array(enrichedMeetingSchema);

// 🔹 Export types
export type MeetingInsertType = z.infer<typeof meetingInsertSchema>;
export type MeetingUpdateType = z.infer<typeof meetingUpdateSchema>;
export type MeetingDeleteType = z.infer<typeof meetingDeleteSchema>;
export type MeetingsQueryType = z.infer<typeof meetingsQuerySchema>;
export type MeetingSchemaType = z.infer<typeof meetingSchema>;
