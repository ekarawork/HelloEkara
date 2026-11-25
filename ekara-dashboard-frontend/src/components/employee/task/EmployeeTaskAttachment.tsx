"use client";

import {
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  X,
} from "lucide-react";

import type { MouseEvent } from "react";

/* ========================= Types ========================= */

export type EmployeeTaskAttachmentType =
  | "image"
  | "pdf"
  | "document"
  | "file";

export interface EmployeeTaskAttachmentData {
  id: number | string;

  /*
   * UI-ready fields.
   */
  name: string;
  url?: string | null;

  type?: EmployeeTaskAttachmentType;

  mimeType?: string | null;
  size?: number | null;
  thumbnailUrl?: string | null;

  /*
   * API-compatible fields.
   */
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  resource_type?: string | null;
}

/* ========================= Props ========================= */

interface EmployeeTaskAttachmentProps {
  attachment: EmployeeTaskAttachmentData;

  compact?: boolean;
  removable?: boolean;
  loading?: boolean;

  onRemove?: (
    attachment: EmployeeTaskAttachmentData
  ) => void;

  onOpen?: (
    attachment: EmployeeTaskAttachmentData
  ) => void;
}

/* ========================= Component ========================= */

export default function EmployeeTaskAttachment({
  attachment,
  compact = false,
  removable = false,
  loading = false,
  onRemove,
  onOpen,
}: EmployeeTaskAttachmentProps) {
  const normalizedAttachment =
    normalizeAttachment(attachment);

  const attachmentType = getAttachmentType(
    normalizedAttachment
  );

  const isImage = attachmentType === "image";

  /* ========================= Open Attachment ========================= */

  const handleOpen = () => {
    if (loading) {
      return;
    }

    if (onOpen) {
      onOpen(attachment);
      return;
    }

    if (normalizedAttachment.url) {
      window.open(
        normalizedAttachment.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  /* ========================= Remove Attachment ========================= */

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (loading) {
      return;
    }

    onRemove?.(attachment);
  };

  /* ========================= Compact Attachment ========================= */

  if (compact) {
    return (
      <div
        className={`group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 ${
          loading ? "opacity-70" : ""
        }`}
      >
        {/* ========================= Icon ========================= */}

        <EmployeeAttachmentIcon
          type={attachmentType}
          size="small"
        />

        {/* ========================= File Information ========================= */}

        <button
          type="button"
          onClick={handleOpen}
          disabled={
            loading || !normalizedAttachment.url
          }
          className="min-w-0 flex-1 text-left disabled:cursor-default"
        >
          <p className="truncate text-[10px] font-medium text-slate-700 transition hover:text-[#2E3192]">
            {normalizedAttachment.name}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {formatFileSize(normalizedAttachment.size)}
          </p>
        </button>

        {/* ========================= Loading ========================= */}

        {loading && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#2E3192]" />
        )}

        {/* ========================= Open / Download ========================= */}

        {!loading && normalizedAttachment.url && (
          <button
            type="button"
            onClick={handleOpen}
            className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-[#2E3192]/10 hover:text-[#2E3192] group-hover:flex"
            aria-label="Open attachment"
            title="Open attachment"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}

        {/* ========================= Remove ========================= */}

        {removable && !loading && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Remove attachment"
            title="Remove attachment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  /* ========================= Image Attachment ========================= */

  if (isImage) {
    return (
      <div
        className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${
          loading ? "opacity-70" : ""
        }`}
      >
        {/* ========================= Image Preview ========================= */}

        {normalizedAttachment.thumbnailUrl ||
        normalizedAttachment.url ? (
          <button
            type="button"
            onClick={handleOpen}
            disabled={
              loading || !normalizedAttachment.url
            }
            className="block w-full text-left disabled:cursor-default"
          >
            <img
              src={
                normalizedAttachment.thumbnailUrl ||
                normalizedAttachment.url ||
                ""
              }
              alt={normalizedAttachment.name}
              className="max-h-64 w-full object-cover transition duration-200 group-hover:scale-[1.01]"
            />
          </button>
        ) : (
          <div className="flex h-36 items-center justify-center">
            <FileImage className="h-8 w-8 text-slate-300" />
          </div>
        )}

        {/* ========================= Loading Overlay ========================= */}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-[#2E3192]" />
            </div>
          </div>
        )}

        {/* ========================= Remove ========================= */}

        {removable && !loading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-red-500"
            aria-label="Remove attachment"
            title="Remove attachment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* ========================= Image Information ========================= */}

        <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2">
          <FileImage className="h-3.5 w-3.5 shrink-0 text-[#2E3192]" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-slate-700">
              {normalizedAttachment.name}
            </p>

            <p className="text-[9px] text-slate-400">
              {formatFileSize(normalizedAttachment.size)}
            </p>
          </div>

          {!loading && normalizedAttachment.url && (
            <button
              type="button"
              onClick={handleOpen}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-[#2E3192]/10 hover:text-[#2E3192]"
              aria-label="Open attachment"
              title="Open attachment"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ========================= File Attachment ========================= */

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 ${
        loading ? "opacity-70" : ""
      }`}
    >
      {/* ========================= File Icon ========================= */}

      <EmployeeAttachmentIcon type={attachmentType} />

      {/* ========================= File Information ========================= */}

      <button
        type="button"
        onClick={handleOpen}
        disabled={
          loading || !normalizedAttachment.url
        }
        className="min-w-0 flex-1 text-left disabled:cursor-default"
      >
        <p className="truncate text-xs font-medium text-slate-700 transition group-hover:text-[#2E3192]">
          {normalizedAttachment.name}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wide text-slate-400">
            {getAttachmentLabel(attachmentType)}
          </span>

          {normalizedAttachment.size !== null &&
            normalizedAttachment.size !== undefined && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />

                <span className="text-[9px] text-slate-400">
                  {formatFileSize(normalizedAttachment.size)}
                </span>
              </>
            )}
        </div>
      </button>

      {/* ========================= Loading ========================= */}

      {loading && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#2E3192]" />
      )}

      {/* ========================= Open / Download ========================= */}

      {!loading && normalizedAttachment.url && (
        <button
          type="button"
          onClick={handleOpen}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#2E3192]/10 hover:text-[#2E3192]"
          aria-label="Open attachment"
          title="Open attachment"
        >
          <Download className="h-4 w-4" />
        </button>
      )}

      {/* ========================= Remove ========================= */}

      {removable && !loading && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Remove attachment"
          title="Remove attachment"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ========================= Normalize Attachment ========================= */

function normalizeAttachment(
  attachment: EmployeeTaskAttachmentData
): EmployeeTaskAttachmentData {
  const name =
    attachment.name ||
    attachment.file_name ||
    "Attachment";

  const url =
    attachment.url ??
    attachment.file_url ??
    null;

  const mimeType =
    attachment.mimeType ??
    attachment.file_type ??
    null;

  const size =
    attachment.size ??
    attachment.file_size ??
    null;

  const resourceType =
    attachment.resource_type ??
    null;

  return {
    ...attachment,
    name,
    url,
    mimeType,
    size,
    resource_type: resourceType,
  };
}

/* ========================= Attachment Icon ========================= */

function EmployeeAttachmentIcon({
  type,
  size = "normal",
}: {
  type: EmployeeTaskAttachmentType;
  size?: "small" | "normal";
}) {
  const iconSize =
    size === "small"
      ? "h-4 w-4"
      : "h-5 w-5";

  const wrapperSize =
    size === "small"
      ? "h-8 w-8"
      : "h-10 w-10";

  if (type === "image") {
    return (
      <div
        className={`flex ${wrapperSize} shrink-0 items-center justify-center rounded-lg bg-[#2E3192]/10 text-[#2E3192]`}
      >
        <FileImage className={iconSize} />
      </div>
    );
  }

  if (type === "pdf") {
    return (
      <div
        className={`flex ${wrapperSize} shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500`}
      >
        <FileText className={iconSize} />
      </div>
    );
  }

  if (type === "document") {
    return (
      <div
        className={`flex ${wrapperSize} shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500`}
      >
        <FileText className={iconSize} />
      </div>
    );
  }

  return (
    <div
      className={`flex ${wrapperSize} shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500`}
    >
      <File className={iconSize} />
    </div>
  );
}

/* ========================= Attachment Type ========================= */

function getAttachmentType(
  attachment: EmployeeTaskAttachmentData
): EmployeeTaskAttachmentType {
  if (attachment.type) {
    return attachment.type;
  }

  const resourceType =
    attachment.resource_type
      ?.toLowerCase()
      .trim() || "";

  if (
    resourceType === "image" ||
    resourceType === "images"
  ) {
    return "image";
  }

  const mimeType = (
    attachment.mimeType ||
    attachment.file_type ||
    ""
  )
    .toLowerCase()
    .trim();

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (
    mimeType === "application/pdf" ||
    mimeType.includes("pdf")
  ) {
    return "pdf";
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("text") ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    return "document";
  }

  const fileName =
    attachment.name ||
    attachment.file_name ||
    "";

  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase()
      .trim() || "";

  if (
    [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "bmp",
      "svg",
    ].includes(extension)
  ) {
    return "image";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (
    [
      "doc",
      "docx",
      "txt",
      "xls",
      "xlsx",
      "csv",
      "rtf",
    ].includes(extension)
  ) {
    return "document";
  }

  return "file";
}

/* ========================= Attachment Label ========================= */

function getAttachmentLabel(
  type: EmployeeTaskAttachmentType
) {
  switch (type) {
    case "image":
      return "Image";

    case "pdf":
      return "PDF";

    case "document":
      return "Document";

    default:
      return "File";
  }
}

/* ========================= File Size ========================= */

function formatFileSize(size?: number | null) {
  if (
    size === null ||
    size === undefined ||
    Number.isNaN(size)
  ) {
    return "Unknown size";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${(
    size /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}