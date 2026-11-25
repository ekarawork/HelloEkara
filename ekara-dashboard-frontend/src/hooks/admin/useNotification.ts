"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import notificationService from "@/src/services/admin/notification.service";

import {
  Notification,
  NotificationListQuery,
} from "@/src/types/admin/notification.types";


/* =========================================================
   HOOK
========================================================= */

const useNotification = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState<number>(0);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [countLoading, setCountLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const [pagination, setPagination] =
    useState({
      count: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });


  /* =======================================================
     GET NOTIFICATIONS
  ======================================================= */

  const getNotifications = useCallback(
    async (
      query: NotificationListQuery = {}
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await notificationService.getNotifications(
            query
          );

        const rows =
          response?.data?.rows || [];

const responsePagination = response?.data;

if (responsePagination) {
  setPagination({
    count: responsePagination.count,
    page: responsePagination.page,
    limit: responsePagination.limit,
    totalPages: responsePagination.totalPages,
  });
}
        setNotifications(rows);

        if (responsePagination) {
          setPagination(
            responsePagination
          );
        }

        return response;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch notifications.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  /* =======================================================
     GET SINGLE NOTIFICATION
  ======================================================= */

  const getNotification = useCallback(
    async (
      uuid: string
    ) => {
      try {
        setError(null);

        return await notificationService
          .getNotification(uuid);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch notification.";

        setError(message);

        throw err;
      }
    },
    []
  );


  /* =======================================================
     GET UNREAD NOTIFICATIONS
  ======================================================= */

  const getUnreadNotifications =
    useCallback(
      async (
        query: NotificationListQuery = {}
      ) => {
        try {
          setLoading(true);
          setError(null);

          /*
           * Backend:
           * GET /notifications/unread
           *
           * Returns:
           * data: Notification[]
           */

          const response =
            await notificationService.getUnreadNotifications();

          const unreadRows =
            response?.data || [];

          /*
           * Keep unread notifications
           * in local state.
           */

          setNotifications(
            unreadRows
          );

          /*
           * Calculate pagination locally
           * because unread API currently
           * returns an array.
           */

          setPagination({
            count: unreadRows.length,
            page: query.page || 1,
            limit: query.limit || unreadRows.length || 10,
            totalPages:
              unreadRows.length > 0
                ? Math.ceil(
                    unreadRows.length /
                      (query.limit ||
                        unreadRows.length ||
                        10)
                  )
                : 0,
          });

          return response;
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch unread notifications.";

          setError(message);

          throw err;
        } finally {
          setLoading(false);
        }
      },
      []
    );


  /* =======================================================
     GET UNREAD COUNT
  ======================================================= */

  const getUnreadNotificationCount =
    useCallback(
      async () => {
        try {
          setCountLoading(true);
          setError(null);

          const response =
            await notificationService
              .getUnreadNotificationCount();

          const count =
            response?.data?.count || 0;

          setUnreadCount(
            Number(count)
          );

          return Number(count);
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch notification count.";

          setError(message);

          throw err;
        } finally {
          setCountLoading(false);
        }
      },
      []
    );


  /* =======================================================
     MARK NOTIFICATION AS READ
  ======================================================= */

  const markNotificationAsRead =
    useCallback(
      async (
        uuid: string
      ) => {
        try {
          setError(null);

          /*
           * Find current notification first.
           *
           * This is important because unread count
           * should only decrease if notification
           * was actually unread.
           */

          let wasUnread = false;

          setNotifications(
            (currentNotifications) => {
              const notification =
                currentNotifications.find(
                  (item) =>
                    item.uuid === uuid
                );

              wasUnread =
                notification
                  ? !notification.is_read
                  : false;

              return currentNotifications;
            }
          );

          const response =
            await notificationService
              .markNotificationAsRead(
                uuid
              );

          const updatedNotification =
            response?.data;

          /*
           * Update local notification.
           */

          setNotifications(
            (currentNotifications) =>
              currentNotifications.map(
                (notification) =>
                  notification.uuid === uuid
                    ? {
                        ...notification,
                        ...(updatedNotification ||
                          {}),
                        is_read: true,
                        read_at:
                          updatedNotification?.read_at ||
                          new Date().toISOString(),
                      }
                    : notification
              )
          );

          /*
           * Decrease unread count only
           * when notification was unread.
           */

          if (wasUnread) {
            setUnreadCount(
              (currentCount) =>
                Math.max(
                  currentCount - 1,
                  0
                )
            );
          }

          return response;
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to mark notification as read.";

          setError(message);

          throw err;
        }
      },
      []
    );


  /* =======================================================
     MARK NOTIFICATION AS UNREAD
  ======================================================= */

  const markNotificationAsUnread =
    useCallback(
      async (
        uuid: string
      ) => {
        try {
          setError(null);

          const response =
            await notificationService
              .markNotificationAsUnread(
                uuid
              );

          const updatedNotification =
            response?.data;

          /*
           * Check whether local notification
           * was already unread.
           */

          let wasAlreadyUnread = false;

          setNotifications(
            (currentNotifications) => {
              const existing =
                currentNotifications.find(
                  (notification) =>
                    notification.uuid === uuid
                );

              wasAlreadyUnread =
                existing
                  ? existing.is_read === false
                  : false;

              return currentNotifications.map(
                (notification) =>
                  notification.uuid === uuid
                    ? {
                        ...notification,
                        ...(updatedNotification ||
                          {}),
                        is_read: false,
                        read_at: null,
                      }
                    : notification
              );
            }
          );

          /*
           * Increase count only when
           * notification was previously read.
           */

          if (!wasAlreadyUnread) {
            setUnreadCount(
              (currentCount) =>
                currentCount + 1
            );
          }

          return response;
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to mark notification as unread.";

          setError(message);

          throw err;
        }
      },
      []
    );


  /* =======================================================
     MARK ALL NOTIFICATIONS AS READ
  ======================================================= */

  const markAllNotificationsAsRead =
    useCallback(
      async () => {
        try {
          setError(null);

          const response =
            await notificationService
              .markAllNotificationsAsRead();

          /*
           * Update local notifications.
           */

          setNotifications(
            (currentNotifications) =>
              currentNotifications.map(
                (notification) => ({
                  ...notification,
                  is_read: true,
                  read_at:
                    notification.read_at ||
                    new Date().toISOString(),
                })
              )
          );

          /*
           * Reset unread count.
           */

          setUnreadCount(0);

          return response;
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to mark all notifications as read.";

          setError(message);

          throw err;
        }
      },
      []
    );


  /* =======================================================
     DELETE NOTIFICATION
  ======================================================= */

  const deleteNotification =
    useCallback(
      async (
        uuid: string
      ) => {
        try {
          setError(null);

          /*
           * Determine whether deleted notification
           * is currently unread.
           */

          let wasUnread = false;

          setNotifications(
            (currentNotifications) => {
              const notification =
                currentNotifications.find(
                  (item) =>
                    item.uuid === uuid
                );

              wasUnread =
                notification
                  ? !notification.is_read
                  : false;

              return currentNotifications;
            }
          );

          const response =
            await notificationService
              .deleteNotification(
                uuid
              );

          /*
           * Remove notification locally.
           */

          setNotifications(
            (currentNotifications) =>
              currentNotifications.filter(
                (notification) =>
                  notification.uuid !== uuid
              )
          );

          /*
           * Decrease unread count if
           * deleted notification was unread.
           */

          if (wasUnread) {
            setUnreadCount(
              (currentCount) =>
                Math.max(
                  currentCount - 1,
                  0
                )
            );
          }

          return response;
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete notification.";

          setError(message);

          throw err;
        }
      },
      []
    );


  /* =======================================================
     REFRESH NOTIFICATIONS
  ======================================================= */

  const refreshNotifications =
    useCallback(
      async () => {
        try {
          setError(null);

          await Promise.all([
            getNotifications({
              page: 1,
              limit: 10,
            }),

            getUnreadNotificationCount(),
          ]);
        } catch (err) {
          /*
           * Error is already handled
           * inside individual functions.
           */

          throw err;
        }
      },
      [
        getNotifications,
        getUnreadNotificationCount,
      ]
    );


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const loadNotificationData =
      async () => {
        try {
          await Promise.all([
            getNotifications({
              page: 1,
              limit: 10,
            }),

            getUnreadNotificationCount(),
          ]);
        } catch {
          /*
           * Error is already handled
           * inside hook functions.
           */
        }
      };

    loadNotificationData();
  }, [
    getNotifications,
    getUnreadNotificationCount,
  ]);


  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* =========================
       STATE
    ========================= */

    notifications,
    unreadCount,

    loading,
    countLoading,

    error,

    pagination,

    /* =========================
       METHODS
    ========================= */

    getNotifications,
    getNotification,

    getUnreadNotifications,
    getUnreadNotificationCount,

    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,

    deleteNotification,

    refreshNotifications,
  };
};


export default useNotification;