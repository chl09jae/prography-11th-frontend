import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import CommonTable from '../components/common/CommonTable';

interface AttendanceLog {
    id: number;
    sessionId: number;
    memberId: number;
    status: string;
    lateMinutes: number | null;
    penaltyAmount: number;
    reason: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function AttendanceDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['attendanceDetail', id],
        queryFn: () => attendanceService.getMemberAttendanceDetail(Number(id)),
        enabled: !!id,
    });

    // --- [벌금/지각비 계산 로직] ---
    const { totalPenalty, latePenalty } = useMemo(() => {
        if (!data?.attendances) return { totalPenalty: 0, latePenalty: 0 };

        return data.attendances.reduce((acc: any, curr: AttendanceLog) => {

            acc.totalPenalty += curr.penaltyAmount;


            if (curr.status === 'LATE') {
                acc.latePenalty += curr.penaltyAmount;
            }

            return acc;
        }, { totalPenalty: 0, latePenalty: 0 });
    }, [data]);

    if (isLoading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;
    if (isError || !data) return <div className="p-10 text-center text-red-500">데이터를 불러오는데 실패했습니다.</div>;

    const totalItems = data.attendances?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedData = data.attendances?.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
    ) || [];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PRESENT': return { text: '출석', color: 'text-blue-600' };
            case 'ABSENT': return { text: '결석', color: 'text-red-500' };
            case 'LATE': return { text: '지각', color: 'text-orange-500' };
            case 'EXCUSED': return { text: '공결', color: 'text-green-600' };
            default: return { text: status, color: 'text-gray-500' };
        }
    };

    const columns = [
        {
            header: '날짜',
            key: 'createdAt',
            render: (item: AttendanceLog) => new Date(item.createdAt).toLocaleDateString()
        },
        {
            header: '출석 여부',
            key: 'status',
            render: (item: AttendanceLog) => {
                const style = getStatusStyle(item.status);
                return (
                    <span className={`font-bold ${style.color}`}>
                        {style.text}
                        {item.lateMinutes ? ` (${item.lateMinutes}분)` : ''}
                    </span>
                );
            }
        },
        {
            header: '벌금',
            key: 'penaltyAmount',
            render: (item: AttendanceLog) => (
                <span className="font-medium text-gray-900">
                    {item.penaltyAmount > 0 ? `${item.penaltyAmount.toLocaleString()}원` : '0원'}
                </span>
            )
        },
        {
            header: '비고',
            key: 'reason',
            render: (item: AttendanceLog) => <span>{item.reason || '-'}</span>
        }
    ];

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-10">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => navigate('/attendance')}>
                    출결 관리
                </h1>
                <span className="text-3xl font-bold text-gray-400">&gt;</span>
                <h1 className="text-3xl font-bold text-gray-900">출결 내역 상세</h1>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-sm font-bold text-gray-500 mb-4 ml-1 uppercase">회원 정보</h2>
                    <div className="bg-[#F9FAFB] rounded-xl p-10 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-2 gap-y-6">
                            <InfoRow label="이름" value={data.memberName} />
                            <InfoRow label="기수" value={`${data.generation}기`} />
                            <InfoRow label="ID" value={String(data.memberId)} />
                            <InfoRow label="파트" value={data.partName || '-'} />
                            <InfoRow label="참여팀" value={data.teamName || '-'} />
                            <InfoRow label="공결 사용" value={`${data.excuseCount || 0}회`} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-gray-500 mb-4 ml-1 uppercase">벌금 현황</h2>
                    <div className="bg-[#F9FAFB] rounded-xl p-10 space-y-6 border border-gray-100 shadow-sm">
                        {/* 벌금 현황: 모든 벌금의 합계 */}
                        <InfoRow
                            label="벌금 현황"
                            value={`${totalPenalty.toLocaleString()}원`}
                            color="text-red-500 font-bold"
                        />
                        <InfoRow
                            label="보증금"
                            value={`${(data.deposit || 0).toLocaleString()}원`}
                            color="text-blue-600 font-bold"
                        />

                        <InfoRow
                            label="지각비"
                            value={`${latePenalty.toLocaleString()}원`}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-gray-500 mb-4 ml-1 uppercase">출결 정보</h2>
                    <CommonTable
                        headers={columns}
                        data={paginatedData}
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </section>
            </div>
        </div>
    );
}

function InfoRow({ label, value, color = "text-gray-900" }: { label: string, value: string | number, color?: string }) {
    return (
        <div className="flex items-center text-[15px]">
            <span className="w-36 font-bold text-gray-700">{label}</span>
            <span className={`${color}`}>{value}</span>
        </div>
    );
}