import axios from 'axios';

export interface Member {
    id: number;
    loginId: string;
    name: string;
    phone: string;
    status: 'ACTIVE' | 'WITHDRAWN'; // 정상, 탈퇴
    attendanceCount: number;      // 누적 출석 횟수
    teamName: string;             // 소속 팀
    partName: string;             // 포지션
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const memberService = {
    // 회원 목록 조회 (페이지네이션, 검색 포함)
    getMembers: async (params: { page: number; size: number; searchType?: string; searchValue?: string }) => {
        const { data } = await axios.get(`${API_BASE_URL}/admin/members`, { params });
        return data.data;
    },

    // 회원 상세 정보 수정
    updateMember: async (id: number, updateData: Partial<Member>) => {
        const { data } = await axios.put(`${API_BASE_URL}/admin/members/${id}`, updateData);
        return data;
    },

    // 회원 탈퇴 처리
    deleteMember: async (id: number) => {
        const { data } = await axios.delete(`${API_BASE_URL}/admin/members/${id}`);
        return data;
    },
};