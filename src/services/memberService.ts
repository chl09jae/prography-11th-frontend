import axios from 'axios';

export interface Member {
    id: number;
    loginId: string;
    name: string;
    phone: string;
    status: 'ACTIVE' | 'WITHDRAWN';
    attendanceCount: number;
    teamName: string;
    partName: string;
    generation: number;
}

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

export const memberService = {
    // 회원 목록 조회
    getMembers: async (params: { page: number; size: number; searchType?: string; searchValue?: string }) => {
        const { data } = await axios.get(`${API_BASE_URL}/members`, { params: params });
        return data.data;
    },

    // 회원 상세 정보 수정
    updateMember: async (id: number, updateData: Partial<Member>) => {
        const { data } = await axios.put(`${API_BASE_URL}/members/${id}`, updateData);
        return data;
    },

    // 회원 탈퇴 처리
    deleteMember: async (id: number) => {
        const { data } = await axios.delete(`${API_BASE_URL}/members/${id}`);
        return data;
    },

    // 신규 회원 등록
    createMember: async (newMember: Partial<Member>) => {
        const { data } = await axios.post(`${API_BASE_URL}/members`, {...newMember, cohortId: 11});
        return data;
    },
};