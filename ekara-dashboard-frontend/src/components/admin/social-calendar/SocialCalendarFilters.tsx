"use client";

import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from "lucide-react";

/* ========================= Types ========================= */

export type SocialCalendarPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube";

export type SocialCalendarStatus =
  | "draft"
  | "approved"
  | "scheduled"
  | "published";

export type SocialCalendarContentType =
  | "post"
  | "reel"
  | "carousel"
  | "story";

export interface SocialCalendarClientOption {
  id: number;
  uuid: string;
  name: string;
}

interface SocialCalendarFiltersProps {
  clients: SocialCalendarClientOption[];

  currentDate: Date;
  onDateChange: (date: Date) => void;

  clientId: string;
  platform: SocialCalendarPlatform | "";
  status: SocialCalendarStatus | "";
  contentType: SocialCalendarContentType | "";

  onClientChange: (value: string) => void;

  onPlatformChange: (
    value: SocialCalendarPlatform | ""
  ) => void;

  onStatusChange: (
    value: SocialCalendarStatus | ""
  ) => void;

  onContentTypeChange: (
    value: SocialCalendarContentType | ""
  ) => void;

  onReset: () => void;
}

/* ========================= Helpers ========================= */

const isSameDate = (
  firstDate: Date,
  secondDate: Date
): boolean => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

/* ========================= Component ========================= */

const SocialCalendarFilters = ({
  clients,
  currentDate,
  onDateChange,
  clientId,
  platform,
  status,
  contentType,
  onClientChange,
  onPlatformChange,
  onStatusChange,
  onContentTypeChange,
  onReset,
}: SocialCalendarFiltersProps) => {
  const today = new Date();

  /* ========================= Mini Calendar Days ========================= */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(
      year,
      month,
      1
    );

    const firstDayWeekIndex =
      firstDayOfMonth.getDay();

    const totalDaysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const previousMonthLastDate = new Date(
      year,
      month,
      0
    ).getDate();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
    }[] = [];

    /* ========================= Previous Month ========================= */

    for (
      let index = firstDayWeekIndex - 1;
      index >= 0;
      index--
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          previousMonthLastDate - index
        ),
        isCurrentMonth: false,
      });
    }

    /* ========================= Current Month ========================= */

    for (
      let day = 1;
      day <= totalDaysInMonth;
      day++
    ) {
      days.push({
        date: new Date(
          year,
          month,
          day
        ),
        isCurrentMonth: true,
      });
    }

    /* ========================= Next Month ========================= */

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextMonthDay
        ),
        isCurrentMonth: false,
      });

      nextMonthDay++;
    }

    return days;
  }, [currentDate]);

  /* ========================= Month Label ========================= */

  const monthLabel = currentDate.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  /* ========================= Previous Month ========================= */

  const handlePreviousMonth = () => {
    onDateChange(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  /* ========================= Next Month ========================= */

  const handleNextMonth = () => {
    onDateChange(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  /* ========================= Date Click ========================= */

  const handleDateClick = (date: Date) => {
    onDateChange(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      )
    );
  };

  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white">
      {/* ========================= HEADER ========================= */}

      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              <Filter
                size={15}
                strokeWidth={1.8}
                className="text-slate-500"
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-tight text-slate-800">
                Filters
              </h3>

              <p className="mt-0.5 text-[9px] text-slate-400">
                Filter calendar posts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            title="Reset filters"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10 active:scale-95"
          >
            <RotateCcw
              size={12}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>

      {/* ========================= MINI CALENDAR ========================= */}

      <div className="border-b border-slate-100 px-4 py-4">
        {/* ========================= MONTH NAVIGATION ========================= */}

        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-[#2E3192] active:scale-95"
          >
            <ChevronLeft
              size={13}
              strokeWidth={1.8}
            />
          </button>

          <h4 className="text-[11px] font-semibold text-slate-800">
            {monthLabel}
          </h4>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-[#2E3192] active:scale-95"
          >
            <ChevronRight
              size={13}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ========================= WEEK DAYS ========================= */}

        <div className="mb-1 grid grid-cols-7">
          {[
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
          ].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="flex h-6 items-center justify-center text-[8px] font-semibold uppercase text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* ========================= DATE GRID ========================= */}

        <div className="grid grid-cols-7 gap-y-0.5">
          {calendarDays.map(
            ({ date, isCurrentMonth }, index) => {
              const isToday = isSameDate(
                date,
                today
              );

              const isSelectedMonth =
                date.getFullYear() ===
                  currentDate.getFullYear() &&
                date.getMonth() ===
                  currentDate.getMonth();

              return (
                <button
                  type="button"
                  key={`${date.toISOString()}-${index}`}
                  onClick={() =>
                    handleDateClick(date)
                  }
                  className="flex h-7 items-center justify-center"
                  title={`Go to ${date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}`}
                >
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-[9px] transition-all",
                      !isCurrentMonth
                        ? "text-slate-300"
                        : "text-slate-600",

                      isSelectedMonth &&
                        isCurrentMonth
                        ? "font-semibold text-[#2E3192]"
                        : "",

                      isToday
                        ? "bg-[#2E3192] font-semibold text-white"
                        : "",

                      !isToday
                        ? "hover:bg-slate-50 hover:text-[#2E3192]"
                        : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* ========================= FILTER BODY ========================= */}

      <div className="space-y-5 p-4">
        {/* ========================= CLIENT ========================= */}

        <FilterSelectField
          id="social-calendar-client"
          label="Client"
          value={clientId}
          onChange={(event) =>
            onClientChange(
              event.target.value
            )
          }
        >
          <option value="">
            All Clients
          </option>

          {clients.map((client) => (
            <option
              key={client.uuid}
              value={String(client.id)}
            >
              {client.name}
            </option>
          ))}
        </FilterSelectField>

        {/* ========================= PLATFORM ========================= */}

        <FilterSelectField
          id="social-calendar-platform"
          label="Platform"
          value={platform}
          onChange={(event) =>
            onPlatformChange(
              event.target.value as
                | SocialCalendarPlatform
                | ""
            )
          }
        >
          <option value="">
            All Platforms
          </option>

          <option value="instagram">
            Instagram
          </option>

          <option value="facebook">
            Facebook
          </option>

          <option value="linkedin">
            LinkedIn
          </option>

          <option value="youtube">
            YouTube
          </option>
        </FilterSelectField>

        {/* ========================= STATUS ========================= */}

        <FilterSelectField
          id="social-calendar-status"
          label="Status"
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | SocialCalendarStatus
                | ""
            )
          }
        >
          <option value="">
            All Status
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="published">
            Published
          </option>
        </FilterSelectField>

        {/* ========================= CONTENT TYPE ========================= */}

        <FilterSelectField
          id="social-calendar-content-type"
          label="Content type"
          value={contentType}
          onChange={(event) =>
            onContentTypeChange(
              event.target.value as
                | SocialCalendarContentType
                | ""
            )
          }
        >
          <option value="">
            All Content Types
          </option>

          <option value="post">
            Post
          </option>

          <option value="reel">
            Reel
          </option>

          <option value="carousel">
            Carousel
          </option>

          <option value="story">
            Story
          </option>
        </FilterSelectField>

        {/* ========================= CONTENT TYPES LEGEND ========================= */}

        <div className="border-t border-slate-100 pt-4">
          <div className="mb-3">
            <h4 className="text-[10px] font-semibold text-slate-800">
              Content types
            </h4>

            <p className="mt-0.5 text-[8px] text-slate-400">
              Post content categories
            </p>
          </div>

          <div className="space-y-2.5">
            <ContentTypeLegend
              type="post"
              label="Post"
            />

            <ContentTypeLegend
              type="reel"
              label="Reel"
            />

            <ContentTypeLegend
              type="carousel"
              label="Carousel"
            />

            <ContentTypeLegend
              type="story"
              label="Story"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

/* ========================= FILTER SELECT FIELD ========================= */

interface FilterSelectFieldProps {
  id: string;
  label: string;
  value: string;
  children: React.ReactNode;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

function FilterSelectField({
  id,
  label,
  value,
  children,
  onChange,
}: FilterSelectFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-[9px] font-medium text-slate-500"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all duration-200 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
      >
        {children}
      </select>
    </div>
  );
}

/* ========================= CONTENT TYPE LEGEND ========================= */

interface ContentTypeLegendProps {
  type: SocialCalendarContentType;
  label: string;
}

function ContentTypeLegend({
  type,
  label,
}: ContentTypeLegendProps) {
  const dotClass: Record<
    SocialCalendarContentType,
    string
  > = {
    post: "bg-[#7C83F5]",
    reel: "bg-[#9254DE]",
    carousel: "bg-[#16B5A5]",
    story: "bg-[#F2A51A]",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${dotClass[type]}`}
      />

      <span className="text-[9px] font-medium text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default SocialCalendarFilters;