import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { memberRoutes } from './memberRoutes';
import { attendanceRoutes } from './attendanceRoutes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/members" replace />,
            },
            ...memberRoutes,
            ...attendanceRoutes,
        ],
    },
]);