import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService, Member } from '../../services/memberService';
import { attendanceService } from '../../services/attendanceService';
import CommonButton from "../common/CommonButton";

interface Props {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MemberEditModal({ member, isOpen, onClose }: Props) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<Partial<Member>>({});

    const deleteMutation = useMutation({
        mutationFn: (id: number) => memberService.deleteMember(id),
        onSuccess: () => {
            alert("정상적으로 처리되었습니다.");
            queryClient.invalidateQueries({ queryKey: ['members'] });
            onClose();
        },
        onError: () => alert("삭제 처리 중 오류가 발생했습니다.")
    });

    const saveMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) => {
            return memberService.updateMember(id, data);
        },
        onSuccess: () => {
            alert("정보가 성공적으로 수정되었습니다.");
            queryClient.invalidateQueries({ queryKey: ['members'] });
            onClose();
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "저장 중 오류가 발생했습니다.";
            alert(errorMsg);
        }
    });

    const { data: attendanceData, isLoading: isAttendanceLoading } = useQuery({
        queryKey: ['memberAttendance', member?.id],
        queryFn: () => attendanceService.getMemberAttendanceDetail(member!.id),
        enabled: !!member?.id && isOpen,
    });

    const totalAttendanceCount = useMemo(() => {
        if (!attendanceData?.attendances) return 0;
        return attendanceData.attendances.filter((record: any) => record.status === 'PRESENT').length;
    }, [attendanceData]);

    // 등록일 포맷팅 (yyyy-mm-dd)
    const formattedDate = useMemo(() => {
        if (!member?.createdAt) return '-';
        return member.createdAt.split('T')[0];
    }, [member?.createdAt]);

    // 모달 열릴 때 초기 데이터 세팅
    useEffect(() => {
        if (isOpen && member) {
            setForm(member);
        }
    }, [member, isOpen]);

    if (!isOpen || !member) return null;

    const handleSave = () => {
        if (!form.name?.trim()) return alert("이름을 입력해주세요.");
        if (!form.phone?.trim()) return alert("연락처를 입력해주세요.");
        if (!form.teamName?.trim()) return alert("팀 정보를 입력해주세요.");
        if (!form.partName?.trim()) return alert("포지션을 입력해주세요.");

        saveMutation.mutate({ id: member.id, data: form });
    };

    const handleWithdraw = () => {
        if (window.confirm(`${member.name} 회원을 정말 삭제/탈퇴 처리하시겠습니까?`)) {
            deleteMutation.mutate(member.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white p-8 rounded-lg w-[600px] shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-800">회원관리 &gt; 회원 상세</h2>
                </div>

                <div className="space-y-5">
                    {/* 이름 */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">이름 *</label>
                        <input
                            type="text"
                            disabled
                            value={form.name || ''}
                            onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full border border-gray-200 p-2.5 rounded text-[14px] bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* 아이디 */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">아이디</label>
                        <input
                            type="text"
                            disabled
                            value={member.loginId || '-'}
                            className="w-full border border-gray-200 p-2.5 rounded text-[14px] bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* 기수 (Text Input으로 수정) */}
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">기수</label>
                            <input
                                type="text"
                                value={form.generation || ''}
                                onChange={e => setForm({...form, generation: e.target.value})}
                                placeholder="예: 11"
                                className="w-full border border-gray-300 p-2.5 rounded text-[14px] outline-none focus:border-black"
                            />
                        </div>
                        {/* 파트 */}
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">파트</label>
                            <input
                                type="text"
                                value={form.partName || ''}
                                onChange={e => setForm({...form, partName: e.target.value})}
                                placeholder="예: Spring"
                                className="w-full border border-gray-300 p-2.5 rounded text-[14px] outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">전화번호 *</label>
                        <input
                            type="text"
                            value={form.phone || ''}
                            onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="010-0000-0000"
                            className="w-full border border-gray-300 p-2.5 rounded text-[14px] outline-none focus:border-black"
                        />
                    </div>

                    {/* 소속 팀 */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">참여팀 *</label>
                        <input
                            type="text"
                            value={form.teamName || ''}
                            onChange={e => setForm({...form, teamName: e.target.value})}
                            className="w-full border border-gray-300 p-2.5 rounded text-[14px] outline-none focus:border-black"
                        />
                    </div>

                    {/* 누적 출석 횟수 */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5 text-blue-600 font-bold">누적 출석 횟수</label>
                        <input
                            type="text"
                            disabled
                            value={isAttendanceLoading ? "로딩 중..." : `${totalAttendanceCount}회`}
                            className="w-full border border-blue-100 p-2.5 rounded text-[14px] bg-blue-50 text-blue-700 font-bold cursor-not-allowed"
                        />
                    </div>

                    {/* 등록일 (yyyy-mm-dd 포맷팅) */}
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">등록일</label>
                        <input
                            type="text"
                            disabled
                            value={formattedDate}
                            className="w-full border border-gray-100 p-2.5 rounded text-[14px] bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex justify-end gap-3 mt-10 pt-6 border-t">
                    <CommonButton
                        label="회원 탈퇴"
                        variant="danger"
                        disabled={member.status === 'WITHDRAWN' || deleteMutation.isPending}
                        onClick={handleWithdraw}
                        className="!bg-white !border-gray-300 !text-gray-600 hover:!bg-gray-50"
                    />
                    <CommonButton
                        label="저장"
                        variant="primary"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="!bg-[#4b4b4b] !border-[#4b4b4b] !px-10"
                    />
                    <CommonButton
                        label="취소"
                        variant="default"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}