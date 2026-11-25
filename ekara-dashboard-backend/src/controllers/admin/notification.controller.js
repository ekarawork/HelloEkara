"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminNotificationService,
} = require("../../services/index");

/* =========================================================
   GET MY NOTIFICATIONS
========================================================= */

const getMyNotifications =
    asyncHandler(async (req, res) => {
        const userId =
            req.user.id;

        const notifications =
            await adminNotificationService.getUserNotifications(
                userId,
                {
                    page:
                        Number(
                            req.query.page
                        ) || 1,

                    limit:
                        Number(
                            req.query.limit
                        ) || 10,

                    is_read:
                        req.query.is_read,

                    type:
                        req.query.type,
                }
            );

        return ResponseHelper.success(
            res,
            "Notifications fetched successfully.",
            notifications
        );
    });

/* =========================================================
   GET NOTIFICATION DETAILS
========================================================= */

const getMyNotification =
    asyncHandler(async (req, res) => {
        const notification =
            await adminNotificationService.getNotification(
                req.params.uuid
            );

        /* =========================
           Ownership Check
        ========================= */

        if (
            Number(
                notification.user_id
            ) !==
            Number(req.user.id)
        ) {
            return ResponseHelper.error(
                res,
                "You are not allowed to access this notification.",
                null,
                403
            );
        }

        return ResponseHelper.success(
            res,
            "Notification fetched successfully.",
            notification
        );
    });

/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

const getUnreadNotifications =
    asyncHandler(async (req, res) => {
        const notifications =
            await adminNotificationService.getUnreadNotifications(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Unread notifications fetched successfully.",
            notifications
        );
    });

/* =========================================================
   GET UNREAD COUNT
========================================================= */

const getUnreadNotificationCount =
    asyncHandler(async (req, res) => {
        const count =
            await adminNotificationService.getUnreadNotificationCount(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Unread notification count fetched successfully.",
            {
                count,
            }
        );
    });

/* =========================================================
   MARK AS READ
========================================================= */

const markNotificationAsRead =
    asyncHandler(async (req, res) => {
        const notification =
            await adminNotificationService.markNotificationAsRead(
                req.params.uuid,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Notification marked as read.",
            notification
        );
    });

/* =========================================================
   MARK AS UNREAD
========================================================= */

const markNotificationAsUnread =
    asyncHandler(async (req, res) => {
        const notification =
            await adminNotificationService.markNotificationAsUnread(
                req.params.uuid,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Notification marked as unread.",
            notification
        );
    });

/* =========================================================
   MARK ALL AS READ
========================================================= */

const markAllNotificationsAsRead =
    asyncHandler(async (req, res) => {
        const result =
            await adminNotificationService.markAllNotificationsAsRead(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "All notifications marked as read.",
            result
        );
    });

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification =
    asyncHandler(async (req, res) => {
        await adminNotificationService.deleteNotification(
            req.params.uuid,
            req.user.id
        );

        return ResponseHelper.success(
            res,
            "Notification deleted successfully."
        );
    });

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getMyNotifications,
    getMyNotification,

    getUnreadNotifications,
    getUnreadNotificationCount,

    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,

    deleteNotification,
};