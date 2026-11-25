"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ========================= Props ========================= */

interface EmployeeTaskPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* ========================= Component ========================= */

export default function EmployeeTaskPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EmployeeTaskPaginationProps) {
  /* ========================= No Pagination ========================= */

  if (totalPages <= 1) {
    return null;
  }

  /* ========================= Generate Page Numbers ========================= */

  const getPageNumbers = (): (
    | number
    | string
  )[] => {
    const pages: (
      | number
      | string
    )[] = [];

    /* ========================= Total Pages <= 5 ========================= */

    if (totalPages <= 5) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    /* ========================= First Page ========================= */

    pages.push(1);

    /* ========================= Left Ellipsis ========================= */

    if (currentPage > 3) {
      pages.push("...");
    }

    /* ========================= Middle Pages ========================= */

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
      pages.push(page);
    }

    /* ========================= Right Ellipsis ========================= */

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    /* ========================= Last Page ========================= */

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  /* ========================= Previous Page ========================= */

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /* ========================= Next Page ========================= */

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /* ========================= Render ========================= */

  return (
    <div className="flex w-full items-center justify-center border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
      <div className="flex items-center gap-1.5">
        {/* ========================= Previous Button ========================= */}

        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition-all
            duration-200
            hover:border-[#B9BAFF]
            hover:bg-[#F8F8FF]
            hover:text-[#2E3192]
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
        >
          <ChevronLeft
            size={16}
            strokeWidth={1.8}
          />
        </button>

        {/* ========================= Page Numbers ========================= */}

        {pageNumbers.map((page, index) => {
          /* ========================= Ellipsis ========================= */

          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                  flex
                  h-8
                  min-w-8
                  items-center
                  justify-center
                  px-1
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                ...
              </span>
            );
          }

          /* ========================= Active Page ========================= */

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              className={`
                flex
                h-8
                min-w-8
                items-center
                justify-center
                rounded-lg
                px-2.5
                text-xs
                font-medium
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-[#2E3192] text-white shadow-sm"
                    : "text-slate-500 hover:bg-[#F0F0FF] hover:text-[#2E3192]"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* ========================= Next Button ========================= */}

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition-all
            duration-200
            hover:border-[#B9BAFF]
            hover:bg-[#F8F8FF]
            hover:text-[#2E3192]
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-slate-200
            disabled:hover:bg-white
            disabled:hover:text-slate-500
          "
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