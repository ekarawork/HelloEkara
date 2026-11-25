"use client";

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, ExternalLink, X } from "lucide-react";
import type { Notification } from "@/src/types/admin/notification.types";
import NotificationItem from "./NotificationItem";

/* =========================================================
   PROPS
========================================================= */

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  loading?: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void | Promise<void>;
  onMarkAsRead: (uuid: string) => void | Promise<unknown>;
  onMarkAllAsRead: () => void | Promise<unknown>;
  onDelete?: (uuid: string) => void | Promise<unknown>;
  onViewAll?: () => void;
}

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatNotificationDate = (date?: string | null): string => {
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
   COMPONENT
========================================================= */

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading = false,
  onClose,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onViewAll,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     CLOSE ON OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="fixed inset-x-3 top-16 z-50 mx-auto max-w-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mx-0 sm:mt-3 sm:w-[420px]"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
            <Bell size={18} className="text-gray-700" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              title="Mark all as read"
            >
              <CheckCheck size={15} />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="Close notifications"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="max-h-[70vh] overflow-y-auto sm:max-h-[420px]">
        {/* LOADING */}
        {loading && (
          <div className="space-y-1 p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3 rounded-xl p-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-100" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
              <Bell size={24} className="text-gray-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">No notifications</h4>
            <p className="mt-1 max-w-[260px] text-xs text-gray-500">
              You don't have any notifications right now.
            </p>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-1 p-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.uuid}
                notification={notification}
                onClick={onNotificationClick}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {!loading && notifications.length > 0 && onViewAll && (
        <div className="border-t border-gray-100 p-2">
          <button
            type="button"
            onClick={onViewAll}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View all notifications
            <ExternalLink size={14} />
          </button>
        </div>
      )}
    </div>
  );
}