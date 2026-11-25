"use client";

import { CalendarDays } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import {
  SocialCalendarPost,
  SocialCalendarPlatform,
  SocialCalendarStatus,
  SocialCalendarContentType,
} from "@/src/types/admin/socialCalendar.types";

interface SocialCalendarDayCellProps {
  date: Date;
  posts: SocialCalendarPost[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onDateClick?: (date: Date) => void;
  onPostClick?: (post: SocialCalendarPost) => void;
}

const platformConfig: Record<
  SocialCalendarPlatform,
  {
    label: string;
    icon: typeof FaInstagram;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebookF,
  },
  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
  },
};

const statusConfig: Record<
  SocialCalendarStatus,
  {
    label: string;
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  approved: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  published: {
    label: "Published",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
};

const contentTypeConfig: Record<
  SocialCalendarContentType,
  string
> = {
  post: "Post",
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getPlatformIcon = (platform: SocialCalendarPlatform) => {
  const config = platformConfig[platform];

  if (!config) {
    return CalendarDays;
  }

  return config.icon;
};

const getPlatformLabel = (
  platform: SocialCalendarPlatform
): string => {
  return platformConfig[platform]?.label || platform;
};

const getStatusConfig = (status: SocialCalendarStatus) => {
  return (
    statusConfig[status] || {
      label: status,
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    }
  );
};

const getPostPreview = (
  post: SocialCalendarPost
): string => {
  if (post.note?.trim()) {
    return post.note.trim();
  }

  return contentTypeConfig[post.content_type] || post.content_type;
};

export default function SocialCalendarDayCell({
  date,
  posts,
  isCurrentMonth,
  isToday,
  onDateClick,
  onPostClick,
}: SocialCalendarDayCellProps) {
  const dateKey = formatDateKey(date);

  const dayNumber = date.getDate();

  const visiblePosts = posts.slice(0, 3);
  const remainingPosts = Math.max(posts.length - 3, 0);

  const handleDateClick = () => {
    onDateClick?.(date);
  };

  return (
    <div
      className={[
        "group relative min-h-[145px] border-b border-r border-gray-200 bg-white p-2 transition-colors",
        "dark:border-gray-800 dark:bg-gray-950",
        "hover:bg-gray-50 dark:hover:bg-gray-900/60",
        !isCurrentMonth
          ? "bg-gray-50/70 dark:bg-gray-950/50"
          : "",
      ].join(" ")}
      data-date={dateKey}
    >
      {/* ========================= DAY HEADER ========================= */}

      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleDateClick}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
            isToday
              ? "bg-black text-white dark:bg-white dark:text-black"
              : isCurrentMonth
              ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              : "text-gray-400 dark:text-gray-600",
          ].join(" ")}
          aria-label={`Add post for ${date.toLocaleDateString()}`}
        >
          {dayNumber}
        </button>

        {posts.length > 0 && (
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        )}
      </div>

      {/* ========================= POSTS ========================= */}

      <div className="space-y-1.5">
        {visiblePosts.map((post) => {
          const PlatformIcon = getPlatformIcon(post.platform);
          const status = getStatusConfig(post.status);

          return (
            <button
              key={post.uuid}
              type="button"
              onClick={() => onPostClick?.(post)}
              className="block w-full rounded-lg border border-gray-200 bg-white p-2 text-left transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              {/* Platform + Status */}

              <div className="flex items-center justify-between gap-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <PlatformIcon className="h-3.5 w-3.5 shrink-0 text-gray-600 dark:text-gray-300" />

                  <span className="truncate text-[11px] font-medium text-gray-700 dark:text-gray-300">
                    {getPlatformLabel(post.platform)}
                  </span>
                </div>

                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              {/* Content Type */}

              <div className="mt-1">
                <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {contentTypeConfig[post.content_type]}
                </span>
              </div>

              {/* Note / Preview */}

              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-600 dark:text-gray-400">
                {getPostPreview(post)}
              </p>
            </button>
          );
        })}

        {/* ========================= MORE POSTS ========================= */}

        {remainingPosts > 0 && (
          <button
            type="button"
            onClick={handleDateClick}
            className="w-full rounded-md px-1 py-1 text-left text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            +{remainingPosts} more{" "}
            {remainingPosts === 1 ? "post" : "posts"}
          </button>
        )}

        {/* ========================= EMPTY DAY ========================= */}

        {posts.length === 0 && (
          <button
            type="button"
            onClick={handleDateClick}
            className="flex w-full items-center justify-center rounded-lg border border-dashed border-transparent py-5 text-gray-300 opacity-0 transition-all group-hover:border-gray-200 group-hover:opacity-100 dark:text-gray-700 dark:group-hover:border-gray-800"
            aria-label={`Add post for ${date.toLocaleDateString()}`}
          >
            <span className="text-[10px] font-medium">
              + Add post
            </span>
          </button>
        )}
      </div>
    </div>
  );
}