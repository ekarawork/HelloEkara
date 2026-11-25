"use client";

import {
  CalendarDays,
  FileText,
  Hash,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

import {
  SocialCalendarPost,
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/admin/socialCalendar.types";

interface SocialCalendarDetailsProps {
  post: SocialCalendarPost;
  onEdit?: (post: SocialCalendarPost) => void;
  onDelete?: (post: SocialCalendarPost) => void;
  isLoading?: boolean;
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

const formatDate = (date: string): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date?: string): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (
  status: SocialCalendarStatus
): string => {
  switch (status) {
    case "draft":
      return "bg-slate-50 text-slate-600 border-slate-200";

    case "approved":
      return "bg-blue-50 text-blue-600 border-blue-100";

    case "scheduled":
      return "bg-amber-50 text-amber-600 border-amber-100";

    case "published":
      return "bg-green-50 text-green-600 border-green-100";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getClientInitials = (
  clientName: string
): string => {
  const words = clientName
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return clientName
    .slice(0, 2)
    .toUpperCase();
};

/* ========================= Component ========================= */

export default function SocialCalendarDetails({
  post,
  onEdit,
  onDelete,
  isLoading = false,
}: SocialCalendarDetailsProps) {
  const clientName =
    post.client?.name?.trim() ||
    "Unknown Client";

  const typeColor =
    contentTypeColor[post.content_type];

  const typeBackground =
    contentTypeBg[post.content_type];

  const createdByName =
    post.createdBy
      ? `${post.createdBy.first_name || ""} ${
          post.createdBy.last_name || ""
        }`.trim()
      : "";

  return (
    <div className="space-y-5">

      {/* ========================= POST HEADER ========================= */}

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">

        {/* CLIENT INITIALS */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F0FF] text-sm font-semibold text-[#2E3192]">
          {getClientInitials(clientName)}
        </div>

        {/* CLIENT INFO */}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {clientName}
          </h3>

          <p className="truncate text-xs text-slate-400">
            {platformLabels[post.platform]}
            {" • "}
            {contentTypeLabels[post.content_type]}
          </p>
        </div>

        {/* CONTENT TYPE */}

        <div
          className="ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            color: typeColor,
            backgroundColor: typeBackground,
          }}
        >
          {contentTypeLabels[post.content_type]}
        </div>
      </div>

      {/* ========================= POST INFORMATION ========================= */}

      <DetailSection title="Post Information">

        <DetailItem
          icon={<User size={15} />}
          label="Client"
          value={clientName}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Post date"
          value={formatDate(post.post_date)}
        />

        <DetailItem
          icon={<Hash size={15} />}
          label="Platform"
          value={platformLabels[post.platform]}
        />

        <DetailItem
          icon={<FileText size={15} />}
          label="Content type"
          value={contentTypeLabels[post.content_type]}
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
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
              post.status
            )}`}
          >
            {statusLabels[post.status]}
          </span>

        </div>

      </DetailSection>

      {/* ========================= NOTE ========================= */}

      <DetailSection title="Note">

        <div className="px-3.5 py-3">

          {post.note ? (
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
          value={post.uuid || "Not available"}
        />

        {createdByName && (
          <DetailItem
            icon={<User size={15} />}
            label="Created by"
            value={createdByName}
          />
        )}

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Created at"
          value={formatDateTime(post.createdAt)}
        />

        <DetailItem
          icon={<CalendarDays size={15} />}
          label="Updated at"
          value={formatDateTime(post.updatedAt)}
        />

      </DetailSection>

      {/* ========================= ACTIONS ========================= */}

      {(onEdit || onDelete) && (
        <div className="flex items-center justify-end gap-2 pt-1">

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(post)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(post)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}

        </div>
      )}

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