import axiosInstance from "@/src/lib/axios";

import {
  NotificationListQuery,
  GetNotificationsResponse,
  GetNotificationResponse,
  GetUnreadNotificationsResponse,
  GetUnreadNotificationCountResponse,
  MarkNotificationAsReadResponse,
  MarkAllNotificationsAsReadResponse,
  DeleteNotificationResponse,
  MarkNotificationAsUnreadResponse,
} from "@/src/types/admin/notification.types";


/* =========================================================
   GET MY NOTIFICATIONS
========================================================= */

const getNotifications = async (
  query: NotificationListQuery = {}
): Promise<GetNotificationsResponse> => {
  const response =
    await axiosInstance.get<GetNotificationsResponse>(
      "/admin/notifications/list",
      {
        params: query,
      }
    );

  return response.data;
};


/* =========================================================
   GET SINGLE NOTIFICATION
========================================================= */

const getNotification = async (
  uuid: string
): Promise<GetNotificationResponse> => {
  const response =
    await axiosInstance.get<GetNotificationResponse>(
      `/admin/notifications/list/${uuid}`
    );

  return response.data;
};


/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

const getUnreadNotifications =
  async (): Promise<GetUnreadNotificationsResponse> => {
    const response =
      await axiosInstance.get<GetUnreadNotificationsResponse>(
        "/admin/notifications/unread"
      );

    return response.data;
  };


/* =========================================================
   GET UNREAD NOTIFICATION COUNT
========================================================= */

const getUnreadNotificationCount =
  async (): Promise<GetUnreadNotificationCountResponse> => {
    const response =
      await axiosInstance.get<GetUnreadNotificationCountResponse>(
        "/admin/notifications/unread-count"
      );

    return response.data;
  };


/* =========================================================
   MARK NOTIFICATION AS READ
========================================================= */

const markNotificationAsRead = async (
  uuid: string
): Promise<MarkNotificationAsReadResponse> => {
  const response =
    await axiosInstance.patch<MarkNotificationAsReadResponse>(
      `/admin/notifications/${uuid}/read`
    );

  return response.data;
};

/* =========================================================
   MARK NOTIFICATION AS UNREAD
========================================================= */

const markNotificationAsUnread = async (
  uuid: string
): Promise<MarkNotificationAsUnreadResponse> => {
  const response =
    await axiosInstance.patch<MarkNotificationAsUnreadResponse>(
      `/admin/notifications/${uuid}/unread`
    );

  return response.data;
};
/* =========================================================
   MARK ALL NOTIFICATIONS AS READ
========================================================= */

const markAllNotificationsAsRead =
  async (): Promise<MarkAllNotificationsAsReadResponse> => {
    const response =
      await axiosInstance.patch<MarkAllNotificationsAsReadResponse>(
        "/admin/notifications/read-all"
      );

    return response.data;
  };


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification = async (
  uuid: string
): Promise<DeleteNotificationResponse> => {
  const response =
    await axiosInstance.delete<DeleteNotificationResponse>(
      `/admin/notifications/${uuid}`
    );

  return response.data;
};


/* =========================================================
   EXPORTS
========================================================= */

const notificationService = {
  getNotifications,
  getNotification,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  markNotificationAsUnread,
};

export default notificationService;