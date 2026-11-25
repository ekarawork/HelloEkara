"use client";

import notificationApi from "@/src/api/admin/notification.api";


/* =========================================================
   GET NOTIFICATIONS
========================================================= */

const getNotifications = async (
  query = {}
) => {
  return await notificationApi.getNotifications(query);
};


/* =========================================================
   GET SINGLE NOTIFICATION
========================================================= */

const getNotification = async (
  uuid: string
) => {
  return await notificationApi.getNotification(uuid);
};


/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

const getUnreadNotifications = async () => {
  return await notificationApi.getUnreadNotifications();
};


/* =========================================================
   GET UNREAD NOTIFICATION COUNT
========================================================= */

const getUnreadNotificationCount = async () => {
  return await notificationApi.getUnreadNotificationCount();
};


/* =========================================================
   MARK NOTIFICATION AS READ
========================================================= */

const markNotificationAsRead = async (
  uuid: string
) => {
  return await notificationApi.markNotificationAsRead(
    uuid
  );
};


/* =========================================================
   MARK ALL NOTIFICATIONS AS READ
========================================================= */

const markAllNotificationsAsRead = async () => {
  return await notificationApi.markAllNotificationsAsRead();
};


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification = async (
  uuid: string
) => {
  return await notificationApi.deleteNotification(
    uuid
  );
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
};

export default notificationService;