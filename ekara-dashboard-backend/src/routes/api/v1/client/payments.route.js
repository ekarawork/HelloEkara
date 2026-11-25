"use strict";

const express = require("express");

const router =
    express.Router();

const {
    clientPaymentsController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate =
    require("../../../../middleware/clientPortalAuthenticate");

/* =========================================================
   CLIENT PAYMENT DASHBOARD
========================================================= */

router.get(
    "/payments/dashboard",
    clientPortalAuthenticate,
    clientPaymentsController.getPaymentDashboard
);

/* =========================================================
   EXPORT
========================================================= */

module.exports = router;