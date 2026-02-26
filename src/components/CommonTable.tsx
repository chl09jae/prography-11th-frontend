import React from 'react';

interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
}

interface CommonTableProps<T> {
    headers: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    // --- 페이지네이션 Props 추가 ---
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function CommonTable<T>({
                                           headers,
                                           data,
                                           onRowClick,
                                           currentPage,
                                           totalPages,
                                           onPageChange
                                       }: CommonTableProps<T>) {
    return (
        <div className="w-full">
            {/* 테이블 영역 */}
            <div className="overflow-hidden border-t border-gray-800">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {headers.map((col, index) => (
                            <th key={index} className="p-4 font-semibold text-gray-700">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick?.(item)}
                            className={onRowClick ? "hover:bg-gray-50 cursor-pointer transition-colors" : ""}
                        >
                            {headers.map((col, colIndex) => (
                                <td key={colIndex} className="p-4 text-gray-600">
                                    {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 0 && (
                <div className="flex justify-center items-center mt-12 gap-6 text-gray-400 text-sm">
                    <button
                        onClick={() => onPageChange(0)}
                        disabled={currentPage === 0}
                        className="hover:text-black disabled:opacity-30"
                    >
                        |&lt;
                    </button>

                    <button
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="hover:text-black disabled:opacity-30"
                    >
                        &lt;
                    </button>

                    <div className="flex gap-4 px-2">
                        {Array.from({length: totalPages}, (_, i) => {
                            const isActive = currentPage === i;

                            return (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(i)}
                                    className={`transition-all duration-200 text-[15px] min-w-[24px] h-[32px] flex items-center justify-center ${
                                        isActive
                                            ? "text-black-700 !font-extrabold border-b-2 border-black"
                                            : "text-gray-400 font-medium hover:text-gray-700"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="hover:text-black disabled:opacity-30"
                    >
                        &gt;
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="hover:text-black disabled:opacity-30"
                    >
                        &gt;|
                    </button>
                </div>
            )}
        </div>
    );
}