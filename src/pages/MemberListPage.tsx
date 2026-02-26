import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService, Member } from '../services/memberService';
import CommonTable from '../components/common/CommonTable';
import MemberEditModal from "../components/member/MemberEditModal";
import CommonButton from "../components/common/CommonButton";
import MemberAddModal from "../components/member/MemberRegModal";

export default function MemberListPage() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- 모달 관련 상태 ---
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // --- 검색/필터용 로컬 상태 (입력 시 API 호출 방지용) ---
    const [inputSearchValue, setInputSearchValue] = useState(searchParams.get('searchValue') || '');
    const [localFilters, setLocalFilters] = useState({
        status: searchParams.get('status') || '',
        generation: searchParams.get('generation') || '',
        partName: searchParams.get('partName') || '',
        teamName: searchParams.get('teamName') || '',
        searchType: searchParams.get('searchType') || 'name'
    });

    // --- 실제 API 요청에 사용될 확정 상태 ---
    const [queryState, setQueryState] = useState({
        page: Number(searchParams.get('page')) || 0,
        status: searchParams.get('status') || '',
        generation: searchParams.get('generation') || '',
        partName: searchParams.get('partName') || '',
        teamName: searchParams.get('teamName') || '',
        searchType: searchParams.get('searchType') || 'name',
        searchValue: searchParams.get('searchValue') || ''
    });

    // URL 파라미터 동기화
    useEffect(() => {
        const params: any = { page: queryState.page.toString() };
        if (queryState.status) params.status = queryState.status;
        if (queryState.generation) params.generation = queryState.generation;
        if (queryState.partName) params.partName = queryState.partName;
        if (queryState.teamName) params.teamName = queryState.teamName;
        if (queryState.searchValue) {
            params.searchType = queryState.searchType;
            params.searchValue = queryState.searchValue;
        }
        setSearchParams(params, { replace: true });
    }, [queryState, setSearchParams]);

    // [API] 데이터 조회
    const { data, isFetching } = useQuery({
        queryKey: ['members', queryState],
        queryFn: async () => {
            const delay = new Promise((resolve) => setTimeout(resolve, 800));

            const [response] = await Promise.all([
                memberService.getMembers({
                    page: queryState.page,
                    size: 10,
                    status: queryState.status || undefined,
                    generation: queryState.generation ? Number(queryState.generation) : undefined,
                    partName: queryState.partName || undefined,
                    teamName: queryState.teamName || undefined,
                    searchType: queryState.searchValue ? queryState.searchType : undefined,
                    searchValue: queryState.searchValue || undefined,
                }),
                delay
            ]);

            return response;
        },
        staleTime: 0,
    });

    // --- 수정/탈퇴 Mutation ---
    const saveMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) => memberService.updateMember(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            alert("성공적으로 저장되었습니다.");
        },
    });

    const withdrawMutation = useMutation({
        mutationFn: (id: number) => memberService.withdrawMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            alert("탈퇴 처리되었습니다.");
        },
    });

    // 검색 실행
    const handleSearch = () => {
        setQueryState({ ...localFilters, searchValue: inputSearchValue, page: 0 });
    };

    const handleRowClick = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const columns = [
        { header: '회원 ID', key: 'loginId' },
        { header: '이름', key: 'name', render: (m: Member) => <span className="font-bold text-gray-900">{m.name}</span> },
        {
            header: '상태',
            key: 'status',
            render: (m: Member) => {
                const statusMap: any = {
                    ACTIVE: { text: '정상', color: 'text-blue-600' },
                    INACTIVE: { text: '비활성', color: 'text-gray-400' },
                    WITHDRAWN: { text: '탈퇴', color: 'text-red-500' }
                };
                const current = statusMap[m.status] || { text: m.status, color: 'text-gray-500' };
                return <span className={`font-bold ${current.color}`}>{current.text}</span>;
            }
        },
        { header: '소속 팀', key: 'teamName', render: (m: Member) => m.teamName || '-' },
        { header: '포지션', key: 'partName', render: (m: Member) => m.partName || '-' },
    ];

    return (
        <div className="w-full relative">
            <h1 className="text-3xl font-bold mb-10 text-gray-900">회원 관리</h1>

            {/* 검색 필터 영역 */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg mb-8 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-600">상태</span>
                        <select
                            value={localFilters.status}
                            onChange={(e) => setLocalFilters({...localFilters, status: e.target.value})}
                            className="border border-gray-300 rounded px-2 py-1.5 bg-white w-32 outline-none focus:border-gray-500"
                        >
                            <option value="">전체</option>
                            <option value="ACTIVE">정상(ACTIVE)</option>
                            <option value="INACTIVE">비활성(INACTIVE)</option>
                            <option value="WITHDRAWN">탈퇴(WITHDRAWN)</option>
                        </select>
                    </div>
                    <input
                        type="number"
                        value={localFilters.generation}
                        onChange={(e) => setLocalFilters({...localFilters, generation: e.target.value})}
                        placeholder="기수"
                        className="border border-gray-300 rounded px-2 py-1.5 w-20 outline-none focus:border-gray-500"
                    />
                    <input
                        type="text"
                        value={localFilters.partName}
                        onChange={(e) => setLocalFilters({...localFilters, partName: e.target.value})}
                        placeholder="파트명"
                        className="border border-gray-300 rounded px-2 py-1.5 w-32 outline-none focus:border-gray-500"
                    />
                    <input
                        type="text"
                        value={localFilters.teamName}
                        onChange={(e) => setLocalFilters({...localFilters, teamName: e.target.value})}
                        placeholder="팀명"
                        className="border border-gray-300 rounded px-2 py-1.5 w-32 outline-none focus:border-gray-500"
                    />
                </div>

                <div className="border-t border-gray-100"></div>

                <div className="flex items-center gap-4 text-sm">
                    <select
                        value={localFilters.searchType}
                        onChange={(e) => setLocalFilters({...localFilters, searchType: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-2 bg-white w-32 outline-none"
                    >
                        <option value="name">사용자명</option>
                        <option value="loginId">아이디</option>
                        <option value="phone">전화번호</option>
                    </select>
                    <input
                        type="text"
                        value={inputSearchValue}
                        onChange={(e) => setInputSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isFetching && handleSearch()}
                        placeholder="검색어를 입력하세요"
                        className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-1 focus:ring-gray-400"
                    />

                    <CommonButton
                        label="검색"
                        variant="primary"
                        onClick={handleSearch}
                        disabled={isFetching}
                        className="min-w-[100px]"
                    />
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="relative">
                {isFetching && (
                    <div className="absolute inset-0 z-10 bg-white/40 flex flex-col items-center justify-center rounded-lg backdrop-blur-[1px]">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-2"></div>
                        <p className="text-sm font-bold text-gray-700">정보를 가져오고 있습니다...</p>
                    </div>
                )}

                <CommonTable
                    headers={columns}
                    data={data?.content || []}
                    onRowClick={handleRowClick}
                    currentPage={queryState.page}
                    totalPages={data?.totalPages || 0}
                    onPageChange={(newPage) => setQueryState({ ...queryState, page: newPage })}
                />
            </div>

            <CommonButton
                label="회원 추가"
                onClick={() => {
                    setIsAddModalOpen(true);
                }}
            />

            <MemberEditModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <MemberAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}