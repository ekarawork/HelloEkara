"use client";

import {
  CheckCheck,
  Clock,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import type {
  TaskMessageSenderType,
  TaskMessageType,
} from "@/src/types/employee/task.types";

/* ========================= Types ========================= */

export interface EmployeeTaskMessageData {
  id: number;
  senderId: number;
  senderName: string;
  senderType: TaskMessageSenderType;
  senderInitials: string;
  senderProfileImage?: string | null;
  message: string;
  time: string;
  type: TaskMessageType;
  isRead?: boolean;
  attachments?: EmployeeTaskMessageAttachmentData[];
}

export interface EmployeeTaskMessageAttachmentData {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  resourceType?: string | null;
}

/* ========================= Props ========================= */

interface EmployeeTaskMessageProps {
  message: EmployeeTaskMessageData;
  showSender?: boolean;
}

/* ========================= Component ========================= */

export default function EmployeeTaskMessage({
  message,
  showSender = true,
}: EmployeeTaskMessageProps) {
  const isAdminSender = message.senderType === "ADMIN";

  const messageText = message.message?.trim() || "";

  const isAttachmentPlaceholder =
    messageText.toLowerCase() === "attachment";

  /* ========================= System Message ========================= */

  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] text-slate-500">
          <Clock className="h-3 w-3 shrink-0" />

          <span>{message.message}</span>

          <span className="text-slate-400">
            {message.time}
          </span>
        </div>
      </div>
    );
  }

  /* ========================= Main Message ========================= */

  return (
    <div
      className={`flex w-full ${
        isAdminSender
          ? "justify-start"
          : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[78%] gap-2.5 ${
          isAdminSender
            ? "flex-row"
            : "flex-row-reverse"
        }`}
      >
        {/* ========================= Avatar ========================= */}

        <div
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold ${
            isAdminSender
              ? "bg-[#2E3192] text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {message.senderProfileImage ? (
            <img
              src={message.senderProfileImage}
              alt={message.senderName}
              className="h-full w-full object-cover"
            />
          ) : (
            message.senderInitials || "AD"
          )}
        </div>

        {/* ========================= Content ========================= */}

        <div
          className={`flex min-w-0 flex-col ${
            isAdminSender
              ? "items-start"
              : "items-end"
          }`}
        >
          {/* ========================= Sender Info ========================= */}

          {showSender && (
            <div
              className={`mb-1 flex items-center gap-2 ${
                isAdminSender
                  ? "flex-row"
                  : "flex-row-reverse"
              }`}
            >
              <span className="text-[11px] font-medium text-slate-700">
                {message.senderName}
              </span>

              <span className="text-[10px] text-slate-400">
                {message.time}
              </span>
            </div>
          )}

          {/* ========================= Message Bubble ========================= */}

          {!isAttachmentPlaceholder && messageText && (
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                isAdminSender
                  ? "rounded-tl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                  : "rounded-tr-md bg-[#2E3192] text-white"
              }`}
            >
              {messageText}
            </div>
          )}

          {/* ========================= Attachments ========================= */}

          {message.attachments &&
            message.attachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {message.attachments.map((attachment) => (
                  <EmployeeTaskMessageAttachment
                    key={attachment.id}
                    attachment={attachment}
                    isAdminSender={isAdminSender}
                  />
                ))}
              </div>
            )}

          {/* ========================= Read Status ========================= */}

          {!isAdminSender && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
              <CheckCheck
                className={`h-3 w-3 ${
                  message.isRead
                    ? "text-[#2E3192]"
                    : "text-slate-400"
                }`}
              />

              <span>
                {message.isRead ? "Read" : "Sent"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= Attachment Component ========================= */

function EmployeeTaskMessageAttachment({
  attachment,
  isAdminSender,
}: {
  attachment: EmployeeTaskMessageAttachmentData;
  isAdminSender: boolean;
}) {
  const fileType =
    attachment.fileType?.toLowerCase() || "";

  const fileName =
    attachment.fileName?.toLowerCase() || "";

  /* ========================= File Type Detection ========================= */

  const isPdf =
    fileType === "application/pdf" ||
    fileName.endsWith(".pdf");

  const isImage =
    (fileType.startsWith("image/") ||
      attachment.resourceType === "image") &&
    !isPdf;

  const isVideo =
    fileType.startsWith("video/");

  const formattedSize =
    attachment.fileSize
      ? formatFileSize(attachment.fileSize)
      : null;

  /* ========================= Image Attachment ========================= */

  if (isImage) {
    return (
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName}
          className="block max-h-[300px] w-full object-cover"
        />

        <div className="px-3 py-2">
          <p className="truncate text-xs font-medium text-slate-700">
            {attachment.fileName}
          </p>

          {formattedSize && (
            <p className="mt-0.5 text-[11px] text-slate-400">
              {formattedSize}
            </p>
          )}
        </div>
      </a>
    );
  }

  /* ========================= Video Attachment ========================= */

  if (isVideo) {
    return (
      <div className="max-w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <video
          src={attachment.fileUrl}
          controls
          preload="metadata"
          className="max-h-[300px] w-full"
        />

        <div className="px-3 py-2">
          <p className="truncate text-xs font-medium text-slate-700">
            {attachment.fileName}
          </p>

          {formattedSize && (
            <p className="mt-0.5 text-[11px] text-slate-400">
              {formattedSize}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ========================= PDF Attachment ========================= */

  if (isPdf) {
    return (
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex max-w-[320px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:bg-slate-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50">
          <FileText className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-700">
            {attachment.fileName}
          </p>

          <div className="mt-0.5 flex items-center gap-2">
            {formattedSize && (
              <span className="text-[11px] text-slate-400">
                {formattedSize}
              </span>
            )}

            <span className="text-[11px] font-medium text-red-500">
              Open PDF
            </span>
          </div>
        </div>
      </a>
    );
  }

  /* ========================= Other File Attachment ========================= */

  return (
    <a
      href={attachment.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex max-w-[320px] items-center gap-3 rounded-xl border px-3 py-3 shadow-sm transition ${
        isAdminSender
          ? "border-slate-200 bg-white hover:bg-slate-50"
          : "border-[#2E3192]/20 bg-[#2E3192]/5 hover:bg-[#2E3192]/10"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          isAdminSender
            ? "bg-slate-100"
            : "bg-[#2E3192]/10"
        }`}
      >
        {isImage ? (
          <ImageIcon
            className={`h-5 w-5 ${
              isAdminSender
                ? "text-slate-600"
                : "text-[#2E3192]"
            }`}
          />
        ) : (
          <FileText
            className={`h-5 w-5 ${
              isAdminSender
                ? "text-slate-600"
                : "text-[#2E3192]"
            }`}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700">
          {attachment.fileName}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          {formattedSize && (
            <span className="text-[11px] text-slate-400">
              {formattedSize}
            </span>
          )}

          <span className="text-[11px] font-medium uppercase text-[#2E3192]">
            Open
          </span>
        </div>
      </div>
    </a>
  );
}

/* ========================= Helpers ========================= */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}