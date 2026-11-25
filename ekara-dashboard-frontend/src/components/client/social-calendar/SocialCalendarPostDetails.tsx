"use client";

import {
  CalendarDays,
  FileText,
  Hash,
  User,
} from "lucide-react";

import {
  ClientSocialCalendarPost,
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/client/socialCalendar.types";

/* ========================= Types ========================= */

interface SocialCalendarPostDetailsProps {
  post: ClientSocialCalendarPost;
}

/* ========================= Labels ========================= */

const platformLabels: Record<
  SocialCalendarPlatform,
  string
> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

const contentTypeLabels: Record<
  SocialCalendarContentType,
  string
> = {
  post: "Post",
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
};

const statusLabels: Record<
  SocialCalendarStatus,
  string
> = {
  draft: "Draft",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
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

/* ========================= Helpers ========================= */

const formatDate = (
  date: string
): string => {
  if (!date) {
    return "Not available";
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

const formatDateTime = (
  date?: string
): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getStatusClass = (
  status: SocialCalendarStatus
): string => {
  switch (status) {
    case "draft":
      return "border-slate-200 bg-slate-50 text-slate-600";

    case "approved":
      return "border-blue-100 bg-blue-50 text-blue-600";

    case "scheduled":
      return "border-amber-100 bg-amber-50 text-amber-600";

    case "published":
      return "border-emerald-100 bg-emerald-50 text-emerald-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

/* ========================= Component ========================= */

export default function SocialCalendarPostDetails({
  post,
}: SocialCalendarPostDetailsProps) {
  const typeColor =
    contentTypeColor[
      post.content_type
    ];

  const typeBackground =
    contentTypeBg[
      post.content_type
    ];

  return (
    <div className="space-y-5">
      {/* ========================= POST HEADER ========================= */}

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        {/* PLATFORM ICON */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F0FF] text-[#2E3192]">
          <CalendarDays
            size={20}
            strokeWidth={1.8}
          />
        </div>

        {/* POST INFO */}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {platformLabels[
              post.platform
            ]}
          </h3>

          <p className="truncate text-xs text-slate-400">
            {contentTypeLabels[
              post.content_type
            ]}
            {" • "}
            {formatDate(
              post.post_date
            )}
          </p>
        </div>

        {/* CONTENT TYPE */}

        <div
          className="ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            color: typeColor,
            backgroundColor:
              typeBackground,
          }}
        >
          {
            contentTypeLabels[
              post.content_type
            ]
          }
        </div>
      </div>

      {/* ========================= POST INFORMATION ========================= */}

      <DetailSection title="Post Information">
        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Post date"
          value={formatDate(
            post.post_date
          )}
        />

        <DetailItem
          icon={<Hash size={15} />}
          label="Platform"
          value={
            platformLabels[
              post.platform
            ]
          }
        />

        <DetailItem
          icon={<FileText size={15} />}
          label="Content type"
          value={
            contentTypeLabels[
              post.content_type
            ]
          }
        />
      </DetailSection>

      {/* ========================= STATUS ========================= */}

      <DetailSection title="Status">
        <div className="flex items-center justify-between gap-3 border-b border-slate-50 px-3.5 py-3 last:border-b-0">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400">
              Current status
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-700">
              Post status
            </p>
          </div>

          <span
            className={[
              "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
              getStatusClass(
                post.status
              ),
            ].join(" ")}
          >
            {
              statusLabels[
                post.status
              ]
            }
          </span>
        </div>
      </DetailSection>

      {/* ========================= NOTE ========================= */}

      <DetailSection title="Note">
        <div className="px-3.5 py-3">
          {post.note?.trim() ? (
            <p className="whitespace-pre-wrap text-xs leading-5 text-slate-600">
              {post.note}
            </p>
          ) : (
            <p className="text-xs italic text-slate-400">
              No note added for this post.
            </p>
          )}
        </div>
      </DetailSection>

      {/* ========================= RECORD INFORMATION ========================= */}

      <DetailSection title="Record Information">
        <DetailItem
          icon={<Hash size={15} />}
          label="Post ID"
          value={
            post.uuid ||
            "Not available"
          }
        />

        <DetailItem
          icon={<User size={15} />}
          label="Client"
          value="Your account"
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Created at"
          value={formatDateTime(
            post.createdAt
          )}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Updated at"
          value={formatDateTime(
            post.updatedAt
          )}
        />
      </DetailSection>
    </div>
  );
}

/* ========================= DETAIL SECTION ========================= */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </h4>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
        {children}
      </div>
    </section>
  );
}

/* ========================= DETAIL ITEM ========================= */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 px-3.5 py-3 last:border-b-0">
      {icon && (
        <div className="shrink-0 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}