import type { MeetingStatus } from "@/lib/validations/meetings";
import type { AgentModel } from "./agentsTypes";


export interface MeetingModel {
    id: string;
    name: string;
    userId: number;
    agentId: string;
    status: MeetingStatus;
    startedAt: string | null;
    endedAt: string | null;
    transcriptUrl: string | null;
    recordingUrl: string | null;
    summary: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EnrichedMeeting extends MeetingModel {
    duration: number;
    agent: AgentModel;
}

export type MeetingsGetMany = EnrichedMeeting[];



export interface MeetingsListResponse {
    data: EnrichedMeeting[];
    total: number;
    totalPages: number;
}

export interface MeetingDetailResponse {
    id: string;
    name: string;
    userId: number;
    agentId: string;
    status: MeetingStatus;
    startedAt: string | null;
    endedAt: string | null;
    transcriptUrl: string | null;
    recordingUrl: string | null;
    summary: string | null;
    createdAt: string;
    updatedAt: string;
    duration: string | null;
}

export interface CreateMeetingDTO {
    name: string;
    agentId: string;
    status?: MeetingStatus;
    startedAt?: string | null;
    endedAt?: string | null;
    transcriptUrl?: string | null;
    recordingUrl?: string | null;
    summary?: string | null;
    duration?: string | null;
}

export interface UpdateMeetingDTO {
    id: string;
    name?: string;
    status?: MeetingStatus;
    startedAt?: string | null;
    endedAt?: string | null;
    transcriptUrl?: string | null;
    recordingUrl?: string | null;
    summary?: string | null;
}

export interface MeetingsFilters {
    search?: string;
    page?: number;
    status?: MeetingStatus;
    agentId?: string;
    userId?: number;
}
