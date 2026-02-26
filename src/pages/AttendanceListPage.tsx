import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import { DateUtils } from '../utils/DateUtils';
import CommonTable from '../components/common/CommonTable';
import CommonButton from '../components/common/CommonButton';

export default function AttendanceListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [tempStartDate, setTempStartDate] = useState(searchParams.get('dateFrom') || DateUtils.getOneYearAgo());
    const [tempEndDate, setTempEndDate] = useState(searchParams.get('dateTo') || DateUtils.getToday());

    const [queryFilter, setQueryFilter] = useState({
        startDate: searchParams.get('dateFrom') || DateUtils.getOneYearAgo(),
        endDate: searchParams.get('dateTo') || DateUtils.getToday(),
    });

    const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
        searchParams.get('sessionId') ? Number(searchParams.get('sessionId')) : null
    );

    const handleSearch = () => {
        setPage(0);
        setQueryFilter({
            startDate: tempStartDate,
            endDate: tempEndDate,
        });

        const params: any = {
            dateFrom: tempStartDate,
            dateTo: tempEndDate,
            page: '0',
        };
        if (selectedSessionId) params.sessionId = selectedSessionId.toString();

        setSearchParams(params, { replace: true });
    };

    useEffect(() => {
        if (selectedSessionId) {
            const currentParams = Object.fromEntries(searchParams.entries());
            setSearchParams({ ...currentParams, sessionId: selectedSessionId.toString() }, { replace: true });
        }
    }, [selectedSessionId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // [API] 호출
    const { data: memberListData, isFetching: isMemberListLoading } = useQuery({
        queryKey: ['members-master'],
        queryFn: async () => {
            const [response] = await Promise.all([
                attendanceService.getMembersDashboard(0, 1000),
                new Promise((resolve) => setTimeout(resolve, 800))
            ]);
            return response;
        },
    });

    const { data: sessions, isFetching: isSessionsLoading } = useQuery({
        queryKey: ['sessions', queryFilter.startDate, queryFilter.endDate],
        queryFn: () => attendanceService.getSessions(queryFilter.startDate, queryFilter.endDate),
    });

    const { data: attendanceResponse, isFetching: isAttendanceLoading } = useQuery({
        queryKey: ['sessionAttendances', selectedSessionId],
        queryFn: () => attendanceService.getSessionAttendances(selectedSessionId!),
        enabled: !!selectedSessionId,
    });

    const isAnyFetching = isSessionsLoading || isAttendanceLoading || isMemberListLoading;

    const combinedData = useMemo(() => {
        const rawAttendances = attendanceResponse?.attendances || [];
        const memberList = memberListData || [];
        return rawAttendances.map((record: any) => {
            const memberInfo = memberList.find((m: any) => Number(m.id) === Number(record.memberId));
            return {
                ...record,
                memberName: memberInfo?.name || `미등록(${record.memberId})`,
                teamName: memberInfo?.teamName || '-',
                displayDate: record.createdAt ? record.createdAt.split('T')[0] : '-'
            };
        });
    }, [attendanceResponse, memberListData]);

    useEffect(() => {
        if (sessions && sessions.length > 0 && !selectedSessionId) {
            setSelectedSessionId(sessions[0].id);
        }
    }, [sessions, selectedSessionId]);

    const columns = [
        { header: '사용자 명', key: 'memberName', render: (item: any) => <span className="font-bold text-gray-900">{item.memberName}</span> },
        { header: '팀 명', key: 'teamName' },
        { header: '날짜', key: 'displayDate' },
        {
            header: '출석 여부',
            key: 'status',
            render: (item: any) => {
                const labels: any = { PRESENT: '출석', LATE: '지각', ABSENT: '결석', EXCUSED: '공결' };
                const colors: any = { PRESENT: 'text-blue-600', LATE: 'text-orange-500', ABSENT: 'text-red-500', EXCUSED: 'text-green-600' };
                return <span className={`font-bold ${colors[item.status] || 'text-gray-500'}`}>{labels[item.status] || item.status}</span>;
            }
        },
    ];

    return (
        <div className="w-full" onKeyDown={handleKeyDown}>
            <h1 className="text-3xl font-bold mb-10 text-gray-900">출결 관리</h1>

            {/* 필터 영역 */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg mb-8 flex items-center gap-4 text-sm shadow-sm relative">
                <span className="font-bold text-gray-700 w-16">날짜지정</span>
                <div className="flex items-center gap-2">
                    <input type="date" value={tempStartDate} onChange={(e) => setTempStartDate(e.target.value)} className="border border-gray-300 p-2 rounded outline-none focus:border-gray-500 bg-white" />
                    <span className="text-gray-400">~</span>
                    <input type="date" value={tempEndDate} onChange={(e) => setTempEndDate(e.target.value)} className="border border-gray-300 p-2 rounded outline-none focus:border-gray-500 bg-white" />
                </div>

                <div className="flex gap-2 ml-4">
                    <CommonButton label="오늘" variant="default" onClick={() => { setTempStartDate(DateUtils.getToday()); setTempEndDate(DateUtils.getToday()); }} />
                    <CommonButton label="30일" variant="default" onClick={() => { setTempStartDate(DateUtils.getDaysAgo(30)); setTempEndDate(DateUtils.getToday()); }} />
                    <CommonButton label="1년" variant="default" onClick={() => { setTempStartDate(DateUtils.getOneYearAgo()); setTempEndDate(DateUtils.getToday()); }} />
                </div>

                <CommonButton label="검색" variant="primary" disabled={isAnyFetching} onClick={handleSearch} className="ml-auto !min-w-[100px] !h-[38px]" />
            </div>

            {/* 일정 선택 */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center gap-3 border border-gray-100">
                <span className="text-sm font-bold text-gray-600">조회된 일정:</span>
                {sessions && sessions.length > 0 ? (
                    <select
                        className="border border-gray-300 p-2 rounded text-sm w-80 bg-white outline-none focus:border-gray-500"
                        value={selectedSessionId || ''}
                        onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                    >
                        {sessions.map((s: any) => <option key={s.id} value={s.id}>{s.title} ({s.date})</option>)}
                    </select>
                ) : <span className="text-sm text-gray-400 italic">해당 기간에 등록된 일정이 없습니다.</span>}
            </div>

            <div className="mb-4 text-sm text-gray-500 ml-1">
                전체 회원 <span className="text-gray-900 font-bold">{combinedData.length}</span>명
            </div>

            <div className="relative">
                {isAnyFetching && (
                    <div className="absolute inset-0 z-10 bg-white/40 flex flex-col items-center justify-center rounded-lg backdrop-blur-[1px]">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-2"></div>
                        <p className="text-sm font-bold text-gray-700">정보를 가져오고 있습니다...</p>
                    </div>
                )}
                <CommonTable
                    headers={columns}
                    data={combinedData.slice(page * 10, (page + 1) * 10)}
                    onRowClick={(item: any) => navigate(`/attendance/detail/${item.memberId}?${searchParams.toString()}`)}
                    currentPage={page}
                    totalPages={Math.ceil(combinedData.length / 10) || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}