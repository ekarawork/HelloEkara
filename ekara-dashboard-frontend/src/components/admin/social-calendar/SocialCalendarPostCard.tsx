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
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/admin/socialCalendar.types";

interface SocialCalendarPostCardProps {
  post: SocialCalendarPost;
  onClick?: (post: SocialCalendarPost) => void;
  compact?: boolean;
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

const getPlatformConfig = (
  platform: SocialCalendarPlatform
) => {
  return (
    platformConfig[platform] || {
      label: platform,
      icon: CalendarDays,
    }
  );
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

const formatPostDate = (date: string): string => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function SocialCalendarPostCard({
  post,
  onClick,
  compact = false,
}: SocialCalendarPostCardProps) {
  const platform = getPlatformConfig(post.platform);
  const status = getStatusConfig(post.status);

  const PlatformIcon = platform.icon;

  const contentType =
    contentTypeConfig[post.content_type] ||
    post.content_type;

  const handleClick = () => {
    onClick?.(post);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group w-full rounded-xl border border-gray-200 bg-white text-left transition-all",
        "hover:border-gray-300 hover:shadow-sm",
        "dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700",
        compact ? "p-2" : "p-3",
      ].join(" ")}
    >
      {/* ========================= HEADER ========================= */}

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <PlatformIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
              {platform.label}
            </p>

            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {contentType}
            </p>
          </div>
        </div>

        {/* Status */}

        <span
          className={[
            "shrink-0 rounded-full px-2 py-1 text-[9px] font-medium",
            status.className,
          ].join(" ")}
        >
          {status.label}
        </span>
      </div>

      {/* ========================= CLIENT ========================= */}

      {!compact && post.client && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-400">
              {post.client.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
          </div>

          <span className="truncate text-[11px] font-medium text-gray-600 dark:text-gray-400">
            {post.client.name}
          </span>
        </div>
      )}

      {/* ========================= NOTE ========================= */}

      {post.note?.trim() && (
        <p
          className={[
            "text-gray-600 dark:text-gray-400",
            compact
              ? "mt-1 line-clamp-2 text-[10px] leading-4"
              : "mt-3 line-clamp-3 text-xs leading-5",
          ].join(" ")}
        >
          {post.note}
        </p>
      )}

      {/* ========================= FOOTER ========================= */}

      {!compact && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-2.5 dark:border-gray-800">
          <CalendarDays className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />

          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
            {formatPostDate(post.post_date)}
          </span>
        </div>
      )}

      {/* ========================= HOVER INDICATOR ========================= */}

      <div className="mt-1 text-right">
        <span className="text-[9px] font-medium text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500">
          View post
        </span>
      </div>
    </button>
  );
}