"use strict";

const express = require("express");

const router = express.Router();

const {
    clientDashboardController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate = require(
    "../../../../middleware/clientPortalAuthenticate"
);

/* =========================================================
   CLIENT DASHBOARD
========================================================= */

router.get(
    "/dashboard",
    clientPortalAuthenticate,
    clientDashboardController.getClientDashboard
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = router;