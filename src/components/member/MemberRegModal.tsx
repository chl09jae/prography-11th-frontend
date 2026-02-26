import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../../services/memberService';
import CommonButton from "../common/CommonButton";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function MemberAddModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();

    // 초기값 세팅 (API 명세 기준)
    const [form, setForm] = useState({
        loginId: '',
        password: '',
        name: '',
        phone: '',
        cohortId: 11 // 11로 고정
    });

    const addMutation = useMutation({
        mutationFn: (data: any) => memberService.createMember(data),
        onSuccess: () => {
            alert("신규 회원이 등록되었습니다.");
            queryClient.invalidateQueries({ queryKey: ['members'] });
            handleClose();
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "등록 중 오류가 발생했습니다.";
            alert(errorMsg);
        }
    });

    const handleClose = () => {
        setForm({
            loginId: '',
            password: '',
            name: '',
            phone: '',
            cohortId: 11
        });
        onClose();
    };

    const handleRegister = () => {
        // 유효성 검증 (아이디, 비밀번호, 이름, 전화번호 필수)
        if (!form.loginId.trim()) return alert("아이디를 입력해주세요.");
        if (!form.password.trim()) return alert("비밀번호를 입력해주세요.");
        if (!form.name.trim()) return alert("이름을 입력해주세요.");
        if (!form.phone.trim()) return alert("전화번호를 입력해주세요.");

        addMutation.mutate(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white p-10 rounded-lg w-[500px] shadow-xl">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">회원 등록</h2>

                <div className="space-y-6">
                    {/* 아이디 (loginId) */}
                    <div>
                        <label className="block text-[14px] font-bold text-gray-700 mb-2">아이디 *</label>
                        <input
                            type="text"
                            value={form.loginId}
                            onChange={e => setForm({...form, loginId: e.target.value})}
                            placeholder="아이디를 입력하세요"
                            className="w-full border border-gray-400 p-3 rounded text-[15px] outline-none focus:border-black"
                        />
                    </div>

                    {/* 비밀번호 (password) */}
                    <div>
                        <label className="block text-[14px] font-bold text-gray-700 mb-2">비밀번호 *</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full border border-gray-400 p-3 rounded text-[15px] outline-none focus:border-black"
                        />
                    </div>

                    {/* 이름 (name) */}
                    <div>
                        <label className="block text-[14px] font-bold text-gray-700 mb-2">이름 *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="이름을 입력하세요"
                            className="w-full border border-gray-400 p-3 rounded text-[15px] outline-none focus:border-black"
                        />
                    </div>

                    {/* 전화번호 (phone) */}
                    <div>
                        <label className="block text-[14px] font-bold text-gray-700 mb-2">전화번호 *</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="010-0000-0000"
                            className="w-full border border-gray-400 p-3 rounded text-[15px] outline-none focus:border-black"
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded border border-dashed border-gray-300">
                        <p className="text-[12px] text-gray-500 text-center">
                            기수는 <strong>11기</strong>로 자동 지정됩니다.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-10">
                    <CommonButton
                        label="등록"
                        variant="primary"
                        onClick={handleRegister}
                        disabled={addMutation.isPending}
                        className="!bg-[#4b4b4b] !border-[#4b4b4b] !px-12 !py-3 !text-[16px]"
                    />
                    <CommonButton
                        label="취소"
                        variant="default"
                        onClick={handleClose}
                        className="!px-10 !py-3 !text-[16px]"
                    />
                </div>
            </div>
        </div>
    );
}