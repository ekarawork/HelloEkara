"use strict";

const express = require("express");

const router = express.Router();

const {
    adminPaymentReminderLogController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET PAYMENT REMINDER LOGS
========================================================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentReminderLogController.getPaymentReminderLogs
);

/* =========================================================
   GET PAYMENT REMINDER LOG DETAILS
========================================================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentReminderLogController.getPaymentReminderLog
);

/* =========================================================
   GET LOGS BY PAYMENT
========================================================= */

router.get(
    "/payment/:paymentUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentReminderLogController.getPaymentReminderLogsByPayment
);

/* =========================================================
   GET LOGS BY PAYMENT REMINDER
========================================================= */

router.get(
    "/reminder/:paymentReminderUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentReminderLogController.getPaymentReminderLogsByReminder
);

module.exports = router;