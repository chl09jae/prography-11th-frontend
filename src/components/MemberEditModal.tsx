import { useState, useEffect } from 'react';
import { Member } from '@/services/memberService';

interface Props {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: Partial<Member>) => void;
    onWithdraw: (id: number) => void;
}

export default function MemberEditModal({ member, isOpen, onClose, onSave, onWithdraw }: Props) {
    const [form, setForm] = useState<Partial<Member>>({});

    useEffect(() => {
        if (member) setForm(member);
    }, [member]);

    if (!isOpen || !member) return null;

    const handleSave = () => {
        // 필수 정보 유효성 검증
        if (!form.phone || !form.teamName || !form.partName) {
            alert("연락처, 팀 정보, 포지션은 필수 입력 항목입니다.");
            return;
        }
        onSave(member.id, form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-[500px] shadow-xl">
                <h2 className="text-xl font-bold mb-6">회원 상세 정보 수정</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500">회원 ID / 이름 (수정 불가)</label>
                        <input type="text" disabled value={`${member.id} / ${member.name}`} className="w-full bg-gray-100 p-2 rounded mt-1 cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold">연락처 *</label>
                        <input type="text" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">소속 팀 *</label>
                        <input type="text" value={form.teamName || ''} onChange={e => setForm({...form, teamName: e.target.value})} className="w-full border p-2 rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">포지션 *</label>
                        <input type="text" value={form.partName || ''} onChange={e => setForm({...form, partName: e.target.value})} className="w-full border p-2 rounded mt-1" />
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => onWithdraw(member.id)}
                        disabled={member.status === 'WITHDRAWN'}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {member.status === 'WITHDRAWN' ? '이미 탈퇴됨' : '회원 탈퇴'}
                    </button>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">취소</button>
                        <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded">저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}