"use client";

import { CalendarDays } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import {
  ClientSocialCalendarPost,
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/client/socialCalendar.types";

/* ========================= Types ========================= */

interface SocialCalendarPostCardProps {
  post: ClientSocialCalendarPost;
  onClick?: (
    post: ClientSocialCalendarPost
  ) => void;
  compact?: boolean;
}

/* ========================= Platform Config ========================= */

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

/* ========================= Status Config ========================= */

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
      "bg-slate-100 text-slate-600",
  },

  approved: {
    label: "Approved",
    className:
      "bg-blue-50 text-blue-700",
  },

  scheduled: {
    label: "Scheduled",
    className:
      "bg-amber-50 text-amber-700",
  },

  published: {
    label: "Published",
    className:
      "bg-emerald-50 text-emerald-700",
  },
};

/* ========================= Content Type Config ========================= */

const contentTypeConfig: Record<
  SocialCalendarContentType,
  string
> = {
  post: "Post",
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
};

/* ========================= Helpers ========================= */

const getPlatformConfig = (
  platform: SocialCalendarPlatform
) => {
  return platformConfig[platform];
};

const getStatusConfig = (
  status: SocialCalendarStatus
) => {
  return statusConfig[status];
};

const formatPostDate = (
  date: string
): string => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(
    `${date.slice(0, 10)}T00:00:00`
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* ========================= Component ========================= */

export default function SocialCalendarPostCard({
  post,
  onClick,
  compact = false,
}: SocialCalendarPostCardProps) {
  const platform =
    getPlatformConfig(
      post.platform
    );

  const status =
    getStatusConfig(
      post.status
    );

  const PlatformIcon =
    platform.icon;

  const contentType =
    contentTypeConfig[
      post.content_type
    ];

  const handleClick = () => {
    onClick?.(post);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group w-full rounded-xl border border-slate-200 bg-white text-left transition-all duration-200",
        "hover:border-slate-300 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10",
        compact
          ? "p-2"
          : "p-3",
      ].join(" ")}
    >
      {/* ========================= HEADER ========================= */}

      <div className="flex items-start justify-between gap-2">
        {/* ========================= PLATFORM ========================= */}

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#2E3192] transition-colors group-hover:bg-[#2E3192]/5">
            <PlatformIcon
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">
              {platform.label}
            </p>

            <p className="text-[10px] text-slate-400">
              {contentType}
            </p>
          </div>
        </div>

        {/* ========================= STATUS ========================= */}

        <span
          className={[
            "shrink-0 rounded-full px-2 py-1 text-[9px] font-medium",
            status.className,
          ].join(" ")}
        >
          {status.label}
        </span>
      </div>

      {/* ========================= NOTE ========================= */}

      {post.note?.trim() && (
        <p
          className={[
            "text-slate-600",
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
        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
          <CalendarDays
            className="h-3.5 w-3.5 text-slate-400"
          />

          <span className="text-[10px] font-medium text-slate-500">
            {formatPostDate(
              post.post_date
            )}
          </span>
        </div>
      )}

      {/* ========================= VIEW INDICATOR ========================= */}

      <div className="mt-1 text-right">
        <span className="text-[9px] font-medium text-[#2E3192] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          View post
        </span>
      </div>
    </button>
  );
}