import React from 'react';

interface Member {
    id: number;
    loginId: string;
    name: string;
    phone: string;
    status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';
    role: string;
    generation: number | null;
    partName: string | null;
    teamName: string | null;
    deposit: number | null;
    createdAt: string;
    updatedAt: string;
}

interface MemberTableProps {
    members: Member[];
    totalPages: number;
    currentPage: number; // 0-based index
    onPageChange: (page: number) => void;
    onEditClick: (member: Member) => void;
}

export default function MemberTable({
                                        members,
                                        totalPages,
                                        currentPage,
                                        onPageChange,
                                        onEditClick,
                                    }: MemberTableProps) {

    const getStatusStyle = (status: Member['status']) => {
        switch (status) {
            case 'ACTIVE':
                return { label: '정상', color: 'text-blue-600' };
            case 'WITHDRAWN':
                return { label: '탈퇴', color: 'text-red-500' };
            default:
                return { label: '비활성', color: 'text-gray-500' };
        }
    };

    return (
        <div className="w-full">
            <div className="mb-2 text-sm text-gray-500">
                현재 페이지: {currentPage + 1} / 전체 페이지: {totalPages}
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-sm shadow-sm">
                <table className="w-full text-left border-collapse bg-white">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">회원 ID</th>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">이름</th>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">상태</th>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">전화번호</th>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">소속 팀</th>
                        <th className="p-3 font-bold text-sm text-gray-700 border-r">포지션</th>
                        <th className="p-3 font-bold text-sm text-gray-700">관리</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {members.length > 0 ? (
                        members.map((member) => {
                            const statusInfo = getStatusStyle(member.status);
                            return (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-sm text-gray-600 border-r">{member.id}</td>
                                    <td className="p-3 text-sm font-semibold border-r">{member.name}</td>
                                    <td className={`p-3 text-sm font-bold border-r ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </td>
                                    <td className="p-3 text-sm text-gray-600 border-r">{member.phone}</td>
                                    <td className="p-3 text-sm text-gray-600 border-r">{member.teamName || '-'}</td>
                                    <td className="p-3 text-sm text-gray-600 border-r">{member.partName || '-'}</td>
                                    <td className="p-3 text-sm">
                                        <button
                                            onClick={() => onEditClick(member)}
                                            className="bg-gray-400 text-white px-4 py-1 rounded-sm text-xs hover:bg-gray-500 transition-colors"
                                        >
                                            수정
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="p-10 text-center text-gray-400">
                                조회된 회원 정보가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-8 gap-1">
                <button
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                    className="px-2 py-1 border text-gray-400 disabled:opacity-30 hover:bg-gray-100"
                >
                    &lt;&lt;
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-2 py-1 border text-gray-400 disabled:opacity-30 hover:bg-gray-100"
                >
                    &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1 text-sm border ${
                            currentPage === pageNum
                                ? 'bg-gray-800 text-white font-bold'
                                : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {pageNum + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-2 py-1 border text-gray-400 disabled:opacity-30 hover:bg-gray-100"
                >
                    &gt;
                </button>

                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-2 py-1 border text-gray-400 disabled:opacity-30 hover:bg-gray-100"
                >
                    &gt;&gt;
                </button>
            </div>
        </div>
    );
}