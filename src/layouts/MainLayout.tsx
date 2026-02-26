import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import logoImg from '../assets/prographyLogo.png';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        { name: '회원 관리', path: '/members' },
        { name: '출결 관리', path: '/attendance' },
    ];

    return (
        <div className="flex min-h-screen w-full bg-white">
            <aside className="w-72 bg-[#EFEFEF] border-r border-gray-300 p-10 flex flex-col sticky top-0 h-screen">
                <div
                    className="mb-20 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img
                        src={logoImg}
                        alt="로고"
                        className="w-32 h-auto object-contain"
                    />
                </div>

                <nav>
                    <ul className="space-y-6">
                        {menus.map((menu) => {
                            const isActive = location.pathname.startsWith(menu.path);
                            return (
                                <li
                                    key={menu.path}
                                    onClick={() => navigate(menu.path)}
                                    className={`flex items-center gap-3 text-xl font-bold cursor-pointer transition-colors
                                    ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <span className="text-xs">●</span>
                                    {menu.name}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 bg-white overflow-y-auto">
                <div className="max-w-6xl mx-auto py-16 px-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}