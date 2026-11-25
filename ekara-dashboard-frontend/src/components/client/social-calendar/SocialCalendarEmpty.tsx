"use client";

import {
  CalendarDays,
  RotateCcw,
} from "lucide-react";

interface SocialCalendarEmptyProps {
  hasFilters?: boolean;
  onReset?: () => void;
}

export default function SocialCalendarEmpty({
  hasFilters = false,
  onReset,
}: SocialCalendarEmptyProps) {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-10">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* ========================= ICON ========================= */}

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F0FF] text-[#2E3192]">
          <CalendarDays
            size={26}
            strokeWidth={1.7}
          />
        </div>

        {/* ========================= CONTENT ========================= */}

        <h3 className="mt-4 text-sm font-semibold text-slate-900 sm:text-base">
          {hasFilters
            ? "No posts found"
            : "No social media posts yet"}
        </h3>

        <p className="mt-1.5 max-w-sm text-[11px] leading-5 text-slate-400 sm:text-xs">
          {hasFilters
            ? "No social media posts match your selected filters. Try changing or resetting the filters."
            : "Your social media posting schedule will appear here once posts are added to your calendar."}
        </p>

        {/* ========================= RESET ========================= */}

        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[10px] font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-[0.98]"
          >
            <RotateCcw
              size={13}
              strokeWidth={1.8}
            />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}