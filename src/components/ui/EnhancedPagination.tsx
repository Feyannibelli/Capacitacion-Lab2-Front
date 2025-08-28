import { Button } from '@/components/ui/button.tsx';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { PageSizeSelector } from '../pokemon/PageSizeSelector.tsx';

interface EnhancedPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function EnhancedPagination({
                                       currentPage,
                                       totalPages,
                                       pageSize,
                                       total,
                                       onPageChange,
                                       onPageSizeChange,
                                   }: EnhancedPaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 4) {
                pages.push('ellipsis');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            const actualStart = Math.max(2, Math.min(start, totalPages - 4));
            const actualEnd = Math.min(totalPages - 1, Math.max(end, 5));

            for (let i = actualStart; i <= actualEnd; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 3) {
                pages.push('ellipsis');
            }

            if (totalPages > 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8">
            {/* Page Size Selector */}
            <div className="flex items-center gap-4">
                <PageSizeSelector
                    currentSize={pageSize}
                    onSizeChange={onPageSizeChange}
                />
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {total} results
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="hover:bg-red-50 hover:border-red-200"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((pageNum, index) => {
                            if (pageNum === 'ellipsis') {
                                return (
                                    <div
                                        key={`ellipsis-${index}`}
                                        className="flex items-center justify-center w-10 h-10"
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </div>
                                );
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onPageChange(pageNum)}
                                    className={
                                        currentPage === pageNum
                                            ? 'bg-red-600 hover:bg-red-700 w-10 h-10 p-0'
                                            : 'hover:bg-red-50 hover:border-red-200 w-10 h-10 p-0'
                                    }
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="hover:bg-red-50 hover:border-red-200"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}