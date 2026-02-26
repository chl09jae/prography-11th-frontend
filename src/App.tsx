import { Link, Outlet, useLocation } from 'react-router-dom';

export default function App() {
    const location = useLocation();

    const menuItems = [
        { name: '회원 관리', path: '/members' },
        { name: '출결 관리', path: '/attendance' },
        { name: '세션 관리', path: '/sessions' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 1. 사이드바 (공통 영역) */}
            <aside className="w-64 bg-gray-200 p-6 flex flex-col gap-10 shadow-inner">
                <div className="text-3xl font-black tracking-tighter text-gray-800">
                    LOGO
                </div>

                <nav>
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`block p-2 text-lg transition-all ${
                                        location.pathname === item.path
                                            ? 'font-bold text-black border-l-4 border-black pl-3'
                                            : 'text-gray-500 hover:text-gray-800 pl-4'
                                    }`}
                                >
                                    • {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-12 bg-white">
                <Outlet />
            </main>
        </div>
    );
}