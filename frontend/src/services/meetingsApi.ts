import type { CreateMeetingDTO, MeetingDetailResponse, MeetingModel, MeetingsFilters, MeetingsListResponse, UpdateMeetingDTO } from '@/types/meetingsTypes';
import apiClient from './apiClient';


export const meetingsApi = {
    getMeetings: async (filters: MeetingsFilters): Promise<MeetingsListResponse> => {
        const response = await apiClient.get('/api/meetings/', {
            params: {
                ...filters
            }
        });
        return response.data.data;
    },
    getOneMeeting: async (id: string): Promise<MeetingDetailResponse> => {
        const response = await apiClient.get(`api/meetings/${id}`);
        return response.data.data;
    },
    createMeeting: async (credentials: CreateMeetingDTO): Promise<MeetingModel> => {
        const response = await apiClient.post(`/api/meetings/`, credentials);
        return response.data.data;
    },
    updateMeeting: async (credentials: UpdateMeetingDTO): Promise<MeetingModel> => {
        const response = await apiClient.patch(`/api/meetings/`, credentials);
        return response.data.data;
    },
    deleteMeeting: async (meetingId: string): Promise<MeetingModel> => {
        const response = await apiClient.delete(`/api/meetings/${meetingId}`);
        return response.data.data;
    },
};