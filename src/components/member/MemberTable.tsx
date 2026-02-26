import React from 'react';
import {Member} from "@/services/memberService";

export default function MemberTable({ members, totalPages, currentPage, onPageChange, onEditClick }: MemberTableProps) {
    const getStatusLabel = (status: Member['status']) => {
        if (status === 'ACTIVE') return { text: '정상', color: 'text-blue-600' };
        if (status === 'WITHDRAWN') return { text: '탈퇴', color: 'text-red-500' };
        return { text: '비활성', color: 'text-gray-500' };
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-4">
                <span className="text-sm text-gray-600 font-medium">전체 {members.length}</span>
            </div>

            <div className="overflow-hidden border-t border-gray-800"> {/* 상단 강조 라인 */}
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-4 font-semibold text-gray-700">회원 ID</th>
                        <th className="p-4 font-semibold text-gray-700">이름</th>
                        <th className="p-4 font-semibold text-gray-700">상태</th>
                        <th className="p-4 font-semibold text-gray-700">전화번호</th>
                        <th className="p-4 font-semibold text-gray-700">소속 팀</th>
                        <th className="p-4 font-semibold text-gray-700">포지션</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {members.map((member) => {
                        const status = getStatusLabel(member.status);
                        return (
                            <tr
                                key={member.id}
                                onClick={() => onEditClick(member)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="p-4 text-gray-500">{member.loginId}</td>
                                <td className="p-4 font-medium text-gray-900">{member.name}</td>
                                <td className={`p-4 font-bold ${status.color}`}>{status.text}</td>
                                <td className="p-4 text-gray-600">{member.phone}</td>
                                <td className="p-4 text-gray-600">{member.teamName || '-'}</td>
                                <td className="p-4 text-gray-600">{member.partName || '-'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-12 gap-4 text-gray-400">
                <button
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                    className="hover:text-black disabled:opacity-20"
                >
                    |&lt;
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="hover:text-black disabled:opacity-20"
                >
                    &lt;
                </button>

                <div className="flex gap-4 px-4">
                    {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`transition-colors ${
                                currentPage === pageNum
                                    ? "text-black font-bold underline underline-offset-4"
                                    : "hover:text-black"
                            }`}
                        >
                            {pageNum + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="hover:text-black disabled:opacity-20"
                >
                    &gt;
                </button>

                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="hover:text-black disabled:opacity-20"
                >
                    &gt;|
                </button>
            </div>
        </div>
    );
}