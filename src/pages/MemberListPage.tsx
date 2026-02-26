import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService, Member } from '../services/memberService';
import MemberTable from '../components/MemberTable';
import MemberEditModal from '../components/MemberEditModal';

export default function MemberListPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. 목록 조회
    const { data } = useQuery({
        queryKey: ['members', page],
        queryFn: () => memberService.getMembers({ page, size: 10 }),
    });

    // 2. 수정/탈퇴 Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) => memberService.updateMember(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            alert("수정되었습니다.");
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (id: number) => memberService.deleteMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            alert("탈퇴 처리되었습니다.");
        }
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">회원 관리</h1>

            <MemberTable
                members={data?.content || []}
                totalPages={data?.totalPages || 0}
                currentPage={page}
                onPageChange={setPage}
                onEditClick={(member) => {
                    setSelectedMember(member);
                    setIsModalOpen(true);
                }}
            />

            <MemberEditModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(id, data) => updateMutation.mutate({ id, data })}
                onWithdraw={(id) => {
                    if (confirm("정말로 탈퇴 처리하시겠습니까?")) {
                        withdrawMutation.mutate(id);
                    }
                }}
            />
        </div>
    );
}