import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // 분리한 routes/index.tsx 임포트
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query 클라이언트 설정
const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}