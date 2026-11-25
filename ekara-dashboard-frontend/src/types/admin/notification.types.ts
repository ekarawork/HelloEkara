/* =========================================================
   NOTIFICATION TYPES
========================================================= */

export type NotificationType =
  | "PAYMENT_REMINDER"
  | "PAYMENT"
  | "CLIENT"
  | "SOCIAL_CALENDAR"
  | "SYSTEM";


/* =========================================================
   NOTIFICATION
========================================================= */

export interface Notification {
  id: number;
  uuid: string;

  user_id: number;

  title: string;
  message: string;

  type: NotificationType;

  reference_type?: string | null;
  reference_id?: number | null;

  is_read: boolean;
  read_at?: string | null;

  createdAt: string;
  updatedAt: string;
}


/* =========================================================
   PAGINATION
========================================================= */

export interface NotificationPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}


/* =========================================================
   NOTIFICATION LIST QUERY
========================================================= */

export interface NotificationListQuery {
  page?: number;
  limit?: number;

  is_read?: boolean;

  type?: NotificationType;
}


/* =========================================================
   NOTIFICATION LIST DATA
========================================================= */

export interface NotificationListData
  extends NotificationPagination {
  rows: Notification[];
}


/* =========================================================
   GET NOTIFICATIONS RESPONSE
========================================================= */

export interface GetNotificationsResponse {
  success: boolean;

  message?: string;

  data: NotificationListData;
}


/* =========================================================
   GET SINGLE NOTIFICATION RESPONSE
========================================================= */

export interface GetNotificationResponse {
  success: boolean;

  message?: string;

  data: Notification;
}


/* =========================================================
   UNREAD NOTIFICATIONS RESPONSE
========================================================= */

export interface GetUnreadNotificationsResponse {
  success: boolean;

  message?: string;

  data: Notification[];
}


/* =========================================================
   UNREAD COUNT RESPONSE
========================================================= */

export interface GetUnreadNotificationCountResponse {
  success: boolean;

  message?: string;

  data: {
    count: number;
  };
}


/* =========================================================
   MARK AS READ RESPONSE
========================================================= */

export interface MarkNotificationAsReadResponse {
  success: boolean;

  message?: string;

  data: Notification;
}


/* =========================================================
   MARK ALL AS READ RESPONSE
========================================================= */

export interface MarkAllNotificationsAsReadResponse {
  success: boolean;

  message?: string;

  data: {
    updatedCount: number;
  };
}


/* =========================================================
   DELETE NOTIFICATION RESPONSE
========================================================= */

export interface DeleteNotificationResponse {
  success: boolean;

  message?: string;

  data?: null;
}