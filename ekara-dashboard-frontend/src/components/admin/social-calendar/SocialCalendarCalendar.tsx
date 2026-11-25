"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  ChevronUp
} from "lucide-react";

import {
  SocialCalendarPost,
  SocialCalendarPlatform,
  SocialCalendarStatus,
  SocialCalendarContentType,
} from "@/src/types/admin/socialCalendar.types";

/* ========================= Types ========================= */

interface SocialCalendarCalendarProps {
  currentDate: Date;
  posts: SocialCalendarPost[];

  onAddPost?: (postDate: string) => void;

  onViewPost?: (post: SocialCalendarPost) => void;
  onEditPost?: (post: SocialCalendarPost) => void;
  onDeletePost?: (post: SocialCalendarPost) => void;
}

/* ========================= Constants ========================= */

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/* ========================= Helpers ========================= */

const formatDate = (date: Date): string => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isSameDate = (
  firstDate: Date,
  secondDate: Date
): boolean => {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
};

/* ========================= Component ========================= */

const SocialCalendarCalendar = ({
  currentDate,
  posts,
  onAddPost,
  onViewPost,
  onEditPost,
  onDeletePost,
}: SocialCalendarCalendarProps) => {
  const today = new Date();
  const [expandedDates, setExpandedDates] = useState<
    Record<string, boolean>
  >({});

  const toggleDatePosts = (dateString: string) => {
  setExpandedDates((previous) => ({
    ...previous,
    [dateString]: !previous[dateString],
  }));
};

  /* ========================= Calendar Days ========================= */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(
      year,
      month,
      1
    );

    const lastDayOfMonth = new Date(
      year,
      month + 1,
      0
    );

    const firstDayWeekIndex =
      firstDayOfMonth.getDay();

    const totalDaysInMonth =
      lastDayOfMonth.getDate();

    const previousMonthLastDate =
      new Date(
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
      let index =
        firstDayWeekIndex - 1;
      index >= 0;
      index--
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          previousMonthLastDate -
            index
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

    const remainingDays =
      42 - days.length;

    for (
      let day = 1;
      day <= remainingDays;
      day++
    ) {
      days.push({
        date: new Date(
          year,
          month + 1,
          day
        ),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  /* ========================= Render ========================= */

  return (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <div className="min-w-[900px]">
      {/* ========================= WEEK HEADER ========================= */}

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="border-r border-slate-100 px-1.5 py-2.5 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-500 last:border-r-0 sm:px-2 sm:py-3 sm:text-[10px]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* ========================= CALENDAR GRID ========================= */}

      <div className="grid min-w-[900px] grid-cols-7">
        {calendarDays.map(
          ({ date, isCurrentMonth }, index) => {
            const dateString =
              formatDate(date);

            /* ========================= POSTS FOR DATE ========================= */

            const dayPosts =
              posts.filter((post) => {
                if (!post.post_date) {
                  return false;
                }

                const postDate =
                  post.post_date.slice(0, 10);

                return (
                  postDate ===
                  dateString
                );
              });

              const isExpanded =
  expandedDates[dateString] || false;

const visiblePosts = isExpanded
  ? dayPosts
  : dayPosts.slice(0, 3);

            const isToday =
              isSameDate(
                date,
                today
              );

            return (
              <div
                key={`${dateString}-${index}`}
                className={[
                  "group relative min-h-[130px] border-b border-r border-slate-100 p-1.5 transition-colors sm:min-h-[140px] sm:p-2",
                  "hover:bg-slate-50/70",
                  !isCurrentMonth
                    ? "bg-slate-50/50"
                    : "bg-white",
                ].join(" ")}
              >
                {/* ========================= DATE HEADER ========================= */}

                <div className="mb-2 flex items-center justify-between gap-1">
                  {/* DATE */}

                  <span
                    className={[
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[10px] font-medium sm:h-7 sm:min-w-7 sm:text-[10px]",
                      isToday
                        ? "bg-[#2E3192] font-semibold text-white"
                        : isCurrentMonth
                          ? "text-slate-700"
                          : "text-slate-300",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </span>

                  {/* ========================= ADD POST ========================= */}

                  <button
                    type="button"
                    onClick={() =>
                      onAddPost?.(
                        dateString
                      )
                    }
                    aria-label={`Add post for ${dateString}`}
                    title={`Add post`}
                    className={[
                      "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      "bg-slate-50 text-slate-400",
                      "border border-transparent",
                      "transition-all duration-200",
                      "hover:border-slate-200 hover:bg-white hover:text-[#2E3192]",
                      "active:scale-95",
                      "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10",
                    ].join(" ")}
                  >
                    <Plus
                      size={14}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>

                {/* ========================= POST COUNT ========================= */}

                {dayPosts.length > 0 && (
                  <div className="mb-1.5">
                    <span className="text-[8px] font-medium text-slate-400 sm:text-[9px]">
                      {dayPosts.length}{" "}
                      {dayPosts.length === 1
                        ? "post"
                        : "posts"}
                    </span>
                  </div>
                )}

                {/* ========================= POSTS ========================= */}

                <div className="space-y-1.5">
  {/* ========================= VISIBLE POSTS ========================= */}

  {visiblePosts.map((post) => (
    <SocialCalendarPostPreview
      key={post.uuid}
      post={post}
      onView={() =>
        onViewPost?.(post)
      }
      onEdit={() =>
        onEditPost?.(post)
      }
      onDelete={() =>
        onDeletePost?.(post)
      }
    />
  ))}

  {/* ========================= MORE / LESS POSTS ========================= */}

  {dayPosts.length > 3 && (
    <button
      type="button"
      onClick={() =>
        toggleDatePosts(dateString)
      }
      className="flex w-full items-center justify-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5 text-[8px] font-medium text-slate-500 transition-all hover:border-slate-200 hover:bg-white hover:text-[#2E3192] sm:text-[9px]"
    >
      {isExpanded ? (
        <>
          Show less
          <ChevronUp
            size={11}
            strokeWidth={1.8}
          />
        </>
      ) : (
        <>
          + {dayPosts.length - 3} more
        </>
      )}
    </button>
  )}
</div>
              </div>
            );
          }
        )}
            </div>
    </div>
  </div>
  );
};

/* ========================= Post Preview ========================= */

interface SocialCalendarPostPreviewProps {
  post: SocialCalendarPost;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SocialCalendarPostPreview = ({
  post,
  onView,
  onEdit,
  onDelete,
}: SocialCalendarPostPreviewProps) => {
  const platformLabel: Record<
    SocialCalendarPlatform,
    string
  > = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
  };

  const statusLabel: Record<
    SocialCalendarStatus,
    string
  > = {
    draft: "Draft",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published",
  };

  const contentTypeLabel: Record<
    SocialCalendarContentType,
    string
  > = {
    post: "Post",
    reel: "Reel",
    carousel: "Carousel",
    story: "Story",
  };

  /* ========================= Content Type Colors ========================= */

  const contentTypeColor: Record<
    SocialCalendarContentType,
    string
  > = {
    post: "#7C83F5",
    reel: "#9254DE",
    carousel: "#16B5A5",
    story: "#F2A51A",
  };

  const contentTypeBg: Record<
    SocialCalendarContentType,
    string
  > = {
    post: "#F1F2FF",
    reel: "#F6F0FF",
    carousel: "#ECFAF8",
    story: "#FFF7E8",
  };

  const typeColor =
    contentTypeColor[post.content_type];

  const typeBackground =
    contentTypeBg[post.content_type];

  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-slate-200 bg-white text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
    >
      {/* ========================= CONTENT TYPE COLOR BAR ========================= */}

      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          backgroundColor: typeColor,
        }}
      />

      <div className="px-1.5 py-1.5 pl-2">
        {/* ========================= MAIN PREVIEW ========================= */}

        <button
          type="button"
          onClick={onView}
          className="w-full text-left focus:outline-none"
        >
          {/* ========================= PLATFORM + TYPE ========================= */}

          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-[8px] font-semibold text-slate-700">
              {platformLabel[post.platform]}
            </span>

            <span
              className="shrink-0 rounded px-1 py-[1px] text-[7px] font-semibold"
              style={{
                color: typeColor,
                backgroundColor: typeBackground,
              }}
            >
              {contentTypeLabel[post.content_type]}
            </span>
          </div>

          {/* ========================= CLIENT ========================= */}

          {post.client?.name && (
            <p className="mt-0.5 truncate text-[8px] text-slate-400">
              {post.client.name}
            </p>
          )}

          {/* ========================= NOTE ========================= */}

          {post.note && (
            <p
              className="mt-1 line-clamp-2 text-[8px] leading-3 text-slate-600"
              title={post.note}
            >
              {post.note}
            </p>
          )}

        </button>

{/* ========================= STATUS + ACTIONS ========================= */}

<div className="mt-1 flex items-center justify-between gap-1">
  {/* STATUS */}

  <span className="inline-flex rounded px-1 py-[1px] bg-slate-50 text-[7px] font-medium text-slate-400">
    {statusLabel[post.status]}
  </span>

  {/* ACTION ICONS */}

  <div className="flex items-center gap-0.5">
    {/* VIEW */}

    <button
      type="button"
      onClick={onView}
      aria-label="View post"
      title="View post"
      className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 transition-all hover:bg-slate-100 hover:text-[#2E3192] active:scale-95 focus:outline-none"
    >
      <Eye
        size={10}
        strokeWidth={1.8}
      />
    </button>

    {/* EDIT */}

    <button
      type="button"
      onClick={onEdit}
      aria-label="Edit post"
      title="Edit post"
      className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 transition-all hover:bg-slate-100 hover:text-[#2E3192] active:scale-95 focus:outline-none"
    >
      <Pencil
        size={10}
        strokeWidth={1.8}
      />
    </button>

    {/* DELETE */}

    <button
      type="button"
      onClick={onDelete}
      aria-label="Delete post"
      title="Delete post"
      className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95 focus:outline-none"
    >
      <Trash2
        size={10}
        strokeWidth={1.8}
      />
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default SocialCalendarCalendar;