"use strict";

const express = require("express");

const router = express.Router();

const {
    settingsController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

/* =========================================================
   ADMIN PROFILE
========================================================= */

router.get(
    "/profile",
    authenticate,
    settingsController.getAdminProfile
);

router.put(
    "/profile",
    authenticate,
    settingsController.updateAdminProfile
);

router.put(
    "/change-password",
    authenticate,
    settingsController.changeAdminPassword
);

/* =========================================================
   PAYMENT REMINDER SETTINGS
========================================================= */

router.get(
    "/payment-reminders",
    authenticate,
    settingsController.getPaymentReminderSettings
);

router.put(
    "/payment-reminders",
    authenticate,
    settingsController.updatePaymentReminderSettings
);

module.exports = router;