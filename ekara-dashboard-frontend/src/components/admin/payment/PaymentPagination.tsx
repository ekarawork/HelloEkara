"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaymentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaymentPaginationProps) {
  /* =========================================================
     DON'T RENDER WHEN PAGINATION IS NOT REQUIRED
  ========================================================= */

  if (totalPages <= 1) {
    return null;
  }

  /* =========================================================
     GENERATE PAGE NUMBERS
  ========================================================= */

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    }

    if (
      currentPage < totalPages - 2 &&
      !pages.includes("...")
    ) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  /* =========================================================
     PREVIOUS PAGE
  ========================================================= */

  const handlePrevious = () => {
    if (currentPage <= 1) {
      return;
    }

    onPageChange(currentPage - 1);
  };

  /* =========================================================
     NEXT PAGE
  ========================================================= */

  const handleNext = () => {
    if (currentPage >= totalPages) {
      return;
    }

    onPageChange(currentPage + 1);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="flex w-full items-center justify-center border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
      <div className="flex items-center gap-1.5">
        {/* PREVIOUS */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500"
        >
          <ChevronLeft
            size={16}
            strokeWidth={1.8}
          />
        </button>

        {/* PAGE NUMBERS */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 min-w-8 items-center justify-center px-1 text-xs font-medium text-slate-400"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={`page-${pageNumber}-${index}`}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={
                isActive ? "page" : undefined
              }
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#2E3192] text-white shadow-sm"
                  : "text-slate-500 hover:bg-[#F0F0FF] hover:text-[#2E3192]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500"
        >
          <ChevronRight
            size={16}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
}