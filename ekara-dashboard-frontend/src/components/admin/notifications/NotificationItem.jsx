"use client";

import { Bell, Check, Trash2 } from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const formatNotificationDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   FORMAT TYPE
========================================================= */

const formatNotificationType = (type) => {
  if (!type) return "Notification";

  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* =========================================================
   COMPONENT
========================================================= */

export default function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
}) {
  if (!notification) return null;

  const isUnread = !notification.is_read;

  /* =======================================================
     CLICK
  ======================================================= */

  const handleClick = () => {
    if (onClick) onClick(notification);
  };

  /* =======================================================
     MARK AS READ
  ======================================================= */

  const handleMarkAsRead = (event) => {
    event.stopPropagation();
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.uuid);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (!onDelete) return;

    try {
      await onDelete(notification.uuid);
    } catch {
      // Error is already handled inside useNotification.
    }
  };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer rounded-xl p-3 transition ${
        isUnread ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      {/* MAIN CONTENT */}
      <div className="flex gap-3">
        {/* NOTIFICATION ICON */}
        <div
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isUnread
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Bell size={16} />

          {isUnread && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          )}
        </div>

        {/* DETAILS */}
        <div className="min-w-0 flex-1">
          {/* TITLE */}
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`truncate text-sm ${
                isUnread
                  ? "font-semibold text-gray-900"
                  : "font-medium text-gray-700"
              }`}
            >
              {notification.title || "Notification"}
            </h4>

            {isUnread && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            )}
          </div>

          {/* MESSAGE */}
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
            {notification.message}
          </p>

          {/* META */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {notification.type && (
                <span className="truncate rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {formatNotificationType(notification.type)}
                </span>
              )}

              <span className="shrink-0 text-[10px] text-gray-400">
                {formatNotificationDate(notification.createdAt)}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
              {isUnread && (
                <button
                  type="button"
                  onClick={handleMarkAsRead}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-900"
                  title="Mark as read"
                  aria-label="Mark notification as read"
                >
                  <Check size={14} />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}