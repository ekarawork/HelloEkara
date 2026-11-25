"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import {
  Paperclip,
  Send,
  Smile,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ========================= Constants ========================= */

const MAX_MESSAGE_LENGTH = 10000;
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",

  // PDF
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Text
  "text/plain",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
].join(",");

/* ========================= Props ========================= */

export interface EmployeeTaskComposerProps {
  onSendMessage?: (
    message: string,
    file?: File | null
  ) => void | Promise<void>;

  onAttachmentClick?: () => void;

  onEmojiClick?: () => void;

  disabled?: boolean;

  placeholder?: string;

  isSending?: boolean;

  isUploading?: boolean;
}

/* ========================= Component ========================= */

export default function EmployeeTaskComposer({
  onSendMessage,
  onAttachmentClick,
  onEmojiClick,
  disabled = false,
  placeholder = "Write a message...",
  isSending = false,
  isUploading = false,
}: EmployeeTaskComposerProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const isDisabled =
    disabled ||
    isSending ||
    isUploading;

  const hasMessage = message.trim().length > 0;
  const hasAttachment = selectedFile !== null;

  const canSend =
    (hasMessage || hasAttachment) &&
    message.trim().length <= MAX_MESSAGE_LENGTH &&
    !isDisabled;

  /* ========================= Send Message ========================= */

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (
      (!trimmedMessage && !selectedFile) ||
      trimmedMessage.length > MAX_MESSAGE_LENGTH ||
      isDisabled
    ) {
      return;
    }

    try {
      await onSendMessage?.(
        trimmedMessage,
        selectedFile
      );

      setMessage("");
      setSelectedFile(null);
    } catch {
      /*
       * Parent component or hook handles
       * API errors and toast notifications.
       *
       * Keep current message and attachment
       * if sending fails.
       */
    }
  };

  /* ========================= Keyboard ========================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSendMessage();
    }
  };

  /* ========================= Attachment Click ========================= */

  const handleAttachmentClick = () => {
    if (isDisabled) {
      return;
    }

    if (onAttachmentClick) {
      onAttachmentClick();
      return;
    }

    fileInputRef.current?.click();
  };

  /* ========================= File Select ========================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    /*
     * Reset input so the same file can be
     * selected again after removing it.
     */

    event.target.value = "";

    if (!file || isDisabled) {
      return;
    }

    /* ========================= File Size ========================= */

    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error("File is too large", {
        description:
          "Maximum file size allowed is 10 MB.",
      });

      return;
    }

    /* ========================= File Type ========================= */

    const acceptedTypes =
      ACCEPTED_FILE_TYPES.split(",");

    if (!acceptedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description:
          "This file type is not supported.",
      });

      return;
    }

    setSelectedFile(file);
  };

  /* ========================= Remove Attachment ========================= */

  const handleRemoveAttachment = () => {
    if (isDisabled) {
      return;
    }

    setSelectedFile(null);
  };

  /* ========================= Emoji ========================= */

  const handleEmojiClick = () => {
    if (isDisabled) {
      return;
    }

    onEmojiClick?.();
  };

  /* ========================= Render ========================= */

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white p-4">
      <div className="mx-auto max-w-4xl">
        {/* ========================= Composer Box ========================= */}

        <div
          className={`rounded-xl border bg-slate-50 transition ${
            isDisabled
              ? "border-slate-200 opacity-70"
              : "border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
          }`}
        >
          {/* ========================= Hidden File Input ========================= */}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
            className="hidden"
            disabled={isDisabled}
          />

          {/* ========================= Selected Attachment ========================= */}

          {selectedFile && (
            <div className="flex items-center gap-2 px-4 pt-3">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <Paperclip className="h-3.5 w-3.5 shrink-0 text-blue-500" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {selectedFile.name}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  disabled={isDisabled}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
                  aria-label="Remove attachment"
                  title="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================= Textarea ========================= */}

          <textarea
            value={message}
            onChange={(event) => {
              setMessage(
                event.target.value.slice(
                  0,
                  MAX_MESSAGE_LENGTH
                )
              );
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isSending
                ? "Sending message..."
                : isUploading
                  ? "Uploading file..."
                  : placeholder
            }
            rows={2}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isDisabled}
            className="w-full resize-none bg-transparent px-4 pt-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          {/* ========================= Bottom Actions ========================= */}

          <div className="flex items-center justify-between px-3 pb-3">
            {/* ========================= Left Actions ========================= */}

            <div className="flex items-center gap-1">
              {/* Attachment */}

              <button
                type="button"
                onClick={handleAttachmentClick}
                disabled={isDisabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                title="Attach file"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Emoji */}

              <button
                type="button"
                onClick={handleEmojiClick}
                disabled={isDisabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                title="Add emoji"
                aria-label="Add emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>

            {/* ========================= Send Button ========================= */}

            <button
              type="button"
              onClick={() => {
                void handleSendMessage();
              }}
              disabled={!canSend}
              className="flex h-8 items-center gap-2 rounded-lg bg-[#2E3192] px-3 text-xs font-medium text-white transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>
                {isSending ? "Sending..." : "Send"}
              </span>

              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ========================= Helper Text ========================= */}

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[10px] text-slate-400">
            Press Enter to send · Shift + Enter for a
            new line
          </p>

          <p className="shrink-0 text-[10px] text-slate-400">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Helpers ========================= */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}