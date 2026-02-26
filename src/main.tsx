import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import MemberListPage from './pages/MemberListPage';
import './index.css';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/members" replace />,
            },
            {
                path: "members",
                element: <MemberListPage />,
            },
            {
                path: "attendance",
                element: <div className="text-2xl font-bold">출결 관리</div>,
            },
            {
                path: "sessions",
                element: <div className="text-2xl font-bold">세션 관리.</div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);