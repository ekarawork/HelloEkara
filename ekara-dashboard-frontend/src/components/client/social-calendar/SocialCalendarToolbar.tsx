"use client";

import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface SocialCalendarToolbarProps {
  currentDate: Date;
  isLoading?: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onRefresh: () => void;
}

const SocialCalendarToolbar = ({
  currentDate,
  isLoading = false,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onRefresh,
}: SocialCalendarToolbarProps) => {
  /* ========================= FORMAT CURRENT MONTH ========================= */

  const monthYear =
    currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* ========================= MONTH INFORMATION ========================= */}

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {monthYear}
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
          View your social media posting schedule in one place.
        </p>
      </div>

      {/* ========================= ACTIONS ========================= */}

      <div className="flex flex-wrap items-center gap-2">
        {/* PREVIOUS MONTH */}

        <button
          type="button"
          onClick={onPreviousMonth}
          disabled={isLoading}
          aria-label="Previous month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft
            size={15}
            strokeWidth={1.8}
          />
        </button>

        {/* TODAY */}

        <button
          type="button"
          onClick={onToday}
          disabled={isLoading}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Today
        </button>

        {/* NEXT MONTH */}

        <button
          type="button"
          onClick={onNextMonth}
          disabled={isLoading}
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
};

export default SocialCalendarToolbar;