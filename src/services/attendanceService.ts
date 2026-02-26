import axios from 'axios';

export interface AttendanceResponse {
    attendanceId: number;
    sessionName: string;
    sessionDate: string;
    status: 'ATTENDANCE' | 'ABSENCE' | 'EXCUSE' | 'LATE';
    score: number;
    description?: string;
}

export interface MemberAttendanceDetail {
    memberId: number;
    memberName: string;
    generation: number | null;
    partName: string | null;
    teamName: string | null;
    deposit: number | null;
    excuseCount: number | null;
    attendances: AttendanceResponse[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

export const attendanceService = {
    // 0번 API: 회원 대시보드 조회 (이름, 팀명, 보증금 정보 가져오기)
    getMembersDashboard: async (page = 0, size = 100) => {
        const response = await axios.get(`${API_BASE_URL}/members`, {
            params: { page, size }
        });
        return response.data.data.content;
    },

    // 8번 API: 일정 목록 조회
    getSessions: async (dateFrom?: string, dateTo?: string) => {
        const response = await axios.get(`${API_BASE_URL}/sessions`, {
            params: { dateFrom, dateTo } //
        });
        return response.data.data;
    },

    // 18번 API: 일정별 출결 목록 조회
    getSessionAttendances: async (sessionId: number): Promise<SessionAttendanceData> => {
        // 실제 API 경로: /api/v1/admin/attendances/sessions/{sessionId}
        const response = await axios.get<ApiResponse<SessionAttendanceData>>(
            `${API_BASE_URL}/attendances/sessions/${sessionId}`
        );

        return response.data.data;
    },

    // 세션 요약 목록 조회 (기존 유지)
    getSessionSummary: async (sessionId: number): Promise<any[]> => {
        const response = await axios.get<ApiResponse<any[]>>(
            `${API_BASE_URL}/attendances/sessions/${sessionId}/summary`
        );
        return response.data.data;
    },

    // 특정 회원의 출결 상세 정보 가져오기
    getMemberAttendanceDetail: async (memberId: number): Promise<MemberAttendanceDetail> => {
        const response = await axios.get<ApiResponse<MemberAttendanceDetail>>(
            `${API_BASE_URL}/attendances/members/${memberId}`
        );

        return response.data.data;
    }
};