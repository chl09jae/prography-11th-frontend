import { RouteObject } from 'react-router-dom';
import AttendanceListPage from '../pages/AttendanceListPage';
import AttendanceDetailPage from '../pages/AttendanceDetailPage';

export const attendanceRoutes: RouteObject[] = [
    {
        path: 'attendance',
        children: [
            {
                index: true,
                element: <AttendanceListPage />,
            },
            {
                path: 'detail/:id',
                element: <AttendanceDetailPage />,
            },
        ],
    },
];