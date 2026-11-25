"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import useNotification from "@/src/hooks/admin/useNotification";
import NotificationDropdown from "./NotificationDropdown";

/* =========================================================
   COMPONENT
========================================================= */

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotification();

  /* =========================================================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  /* =========================================================
     TOGGLE DROPDOWN
  ========================================================= */

  const handleToggle = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      try {
        await refreshNotifications();
      } catch {
        // Error already handled inside useNotification.
      }
    }
  };

  /* =========================================================
     CLOSE DROPDOWN
  ========================================================= */

  const handleClose = () => {
    setIsOpen(false);
  };

  /* =========================================================
     NOTIFICATION CLICK
  ========================================================= */

  const handleNotificationClick = async (notification: any) => {
    if (notification && !notification.is_read) {
      try {
        await markNotificationAsRead(notification.uuid);
      } catch {
        // Error already handled inside useNotification.
      }
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div ref={containerRef} className="relative">
      {/* NOTIFICATION BUTTON */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Bell className="h-5 w-5" strokeWidth={2} />

        {/* UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onClose={handleClose}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
          onDelete={deleteNotification}
        />
      )}
    </div>
  );
}