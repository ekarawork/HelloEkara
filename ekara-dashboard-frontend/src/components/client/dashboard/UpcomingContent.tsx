"use client";

import {
  CalendarDays,
  Clock3,
  FileText,
  PlaySquare,
  Images,
  Smartphone,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import UpcomingContentSkeleton from "./UpcomingContentSkeleton";
import {
  ClientDashboardUpcomingPost,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   PROPS
========================================================= */

interface UpcomingContentProps {
  content: {
    nextPost: ClientDashboardUpcomingPost | null;
  } | null;
  isLoading: boolean;
}

/* =========================================================
   PLATFORM CONFIG
========================================================= */

const platformConfig = {
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
  },

  facebook: {
    label: "Facebook",
    icon: FaFacebook,
  },

  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedin,
  },

  youtube: {
    label: "YouTube",
    icon: FaYoutube,
  },
};

/* =========================================================
   CONTENT TYPE CONFIG
========================================================= */

const contentTypeConfig = {
  post: {
    label: "Post",
    icon: FileText,
  },

  reel: {
    label: "Reel",
    icon: PlaySquare,
  },

  carousel: {
    label: "Carousel",
    icon: Images,
  },

  story: {
    label: "Story",
    icon: Smartphone,
  },
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  dateString: string
): string => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    `${dateString.substring(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function UpcomingContent({
  content,
  isLoading,
}: UpcomingContentProps) {
  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <UpcomingContentSkeleton />;
  }

  const nextPost =
    content?.nextPost || null;

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!nextPost) {
    return (
      <section className="w-full">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Upcoming Content
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Your next scheduled social media content
          </p>
        </div>

        {/* Empty Card */}
        <div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:px-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <CalendarDays
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            No upcoming content
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-400">
            There are no scheduled social media posts at the moment.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     PLATFORM
  ======================================================= */

  const platform =
    platformConfig[nextPost.platform];

  const PlatformIcon =
    platform?.icon || CalendarDays;

  /* =======================================================
     CONTENT TYPE
  ======================================================= */

  const contentType =
    contentTypeConfig[
      nextPost.contentType
    ];

  const ContentTypeIcon =
    contentType?.icon || FileText;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Upcoming Content
        </h2>

        <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
          Your next scheduled social media content
        </p>
      </div>

      {/* Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6">
        {/* Subtle Background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-slate-100/60 blur-3xl transition-all duration-500 group-hover:bg-slate-200/60" />

        <div className="relative">
          {/* Top */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Platform */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                <PlatformIcon
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Next scheduled content
                </p>

                <h3 className="mt-0.5 truncate text-base font-bold text-slate-900">
                  {platform?.label ||
                    "Social Media"}
                </h3>
              </div>
            </div>

            {/* Scheduled Badge */}
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#30369A]">
              <Clock3
                size={14}
                strokeWidth={2}
              />

              <span>Scheduled</span>
            </div>
          </div>

          {/* Content Details */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Content Type */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <ContentTypeIcon
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Content Type
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {contentType?.label ||
                    "Content"}
                </p>
              </div>
            </div>

            {/* Post Date */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <CalendarDays
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Scheduled Date
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {formatDate(
                    nextPost.postDate
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          {nextPost.note && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Note
              </p>

              <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-600">
                {nextPost.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}