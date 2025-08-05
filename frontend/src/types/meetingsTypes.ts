export type MeetingStatus = 'upcoming' | 'active' | 'completed' | 'processing' | 'cancelled';

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

export interface MeetingsListResponse {
    data: MeetingModel[];
    total: number;
    totalPages: number;
}

export interface MeetingDetailResponse {
    data: MeetingModel;
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
