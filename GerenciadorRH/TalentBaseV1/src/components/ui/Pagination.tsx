import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-line bg-white">
      <p className="text-xs text-muted">
        Página {page} de {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-sm border border-line text-muted hover:bg-paper disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="p-1.5 rounded-sm border border-line text-muted hover:bg-paper disabled:opacity-40 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
