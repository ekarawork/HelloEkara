"use strict";

const express = require("express");

const router = express.Router();

const {
    adminNotificationController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET MY NOTIFICATIONS
========================================================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.getMyNotifications
);

/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

router.get(
    "/unread",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.getUnreadNotifications
);

/* =========================================================
   GET UNREAD COUNT
========================================================= */

router.get(
    "/unread-count",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.getUnreadNotificationCount
);

/* =========================================================
   GET NOTIFICATION DETAILS
========================================================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.getMyNotification
);

/* =========================================================
   MARK AS READ
========================================================= */

router.patch(
    "/:uuid/read",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.markNotificationAsRead
);

/* =========================================================
   MARK AS UNREAD
========================================================= */

router.patch(
    "/:uuid/unread",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.markNotificationAsUnread
);

/* =========================================================
   MARK ALL AS READ
========================================================= */

router.patch(
    "/read-all",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.markAllNotificationsAsRead
);

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

router.delete(
    "/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminNotificationController.deleteNotification
);

module.exports = router;