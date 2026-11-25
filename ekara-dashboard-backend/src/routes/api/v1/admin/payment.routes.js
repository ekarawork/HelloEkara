"use strict";

const express = require("express");

const router = express.Router();

const {
    adminPaymentController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* =========================================================
   CREATE PAYMENT

   POST /payments/create
========================================================= */

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.createPayment
);

/* =========================================================
   GET PAYMENT STATS

   GET /payments/stats
========================================================= */

router.get(
    "/stats",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.getPaymentStats
);

/* =========================================================
   GET PAYMENTS

   GET /payments/list
========================================================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.getPayments
);

/* =========================================================
   GET PAYMENT DETAILS

   GET /payments/list/:uuid
========================================================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.getPayment
);

/* =========================================================
   GET PAYMENTS BY CLIENT

   GET /payments/client/:clientId
========================================================= */

router.get(
    "/client/:clientId",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.getPaymentsByClient
);

/* =========================================================
   UPDATE PAYMENT

   PATCH /payments/update/:uuid
========================================================= */

router.patch(
    "/update/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.updatePayment
);

/* =========================================================
   UPDATE PAYMENT STATUS

   PATCH /payments/status/:uuid
========================================================= */

router.patch(
    "/status/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.updatePaymentStatus
);

/* =========================================================
   UPDATE / MUTE PAYMENT REMINDERS

   PATCH /payments/reminders/:uuid
========================================================= */

router.patch(
    "/reminders/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.updatePaymentReminders
);

/* =========================================================
   HARD DELETE PAYMENT

   DELETE /payments/delete/:uuid
========================================================= */

router.delete(
    "/delete/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminPaymentController.deletePayment
);

module.exports = router;