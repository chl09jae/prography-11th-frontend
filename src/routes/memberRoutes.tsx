import { RouteObject } from 'react-router-dom';
import MemberListPage from '../pages/MemberListPage';

// 배열 형태로 내보냅니다.
export const memberRoutes: RouteObject[] = [
    {
        path: 'members',
        element: <MemberListPage />,
    },
];