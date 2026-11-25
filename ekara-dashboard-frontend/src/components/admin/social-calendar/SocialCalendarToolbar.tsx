"use client";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

interface SocialCalendarToolbarProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCreatePost: () => void;
}

const SocialCalendarToolbar = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onCreatePost,
}: SocialCalendarToolbarProps) => {
  /* ========================= FORMAT CURRENT MONTH ========================= */

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* ========================= MONTH INFORMATION ========================= */}

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {monthYear}
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
          All client posting schedules in one view.
        </p>
      </div>

      {/* ========================= ACTIONS ========================= */}

      <div className="flex items-center gap-2">
        {/* PREVIOUS MONTH */}

        <button
          type="button"
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-95"
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
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-[0.98]"
        >
          Today
        </button>

        {/* NEXT MONTH */}

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-95"
        >
          <ChevronRight
            size={15}
            strokeWidth={1.8}
          />
        </button>

        {/* ADD POST */}

        <button
          type="button"
          onClick={onCreatePost}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2E3192] px-4 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#25277d] focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20 focus:ring-offset-1 active:scale-[0.98]"
        >
          <Plus
            size={14}
            strokeWidth={2}
          />

          Add post
        </button>
      </div>
    </div>
  );
};

export default SocialCalendarToolbar;