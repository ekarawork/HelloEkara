"use strict";

const express = require("express");

const router = express.Router();

const {
    clientGoogleAdsPerformanceController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate =
    require("../../../../middleware/clientPortalAuthenticate");

/* =========================================================
   CLIENT GOOGLE ADS DASHBOARD
========================================================= */

router.get(
    "/google-ads/dashboard",
    clientPortalAuthenticate,
    clientGoogleAdsPerformanceController.getGoogleAdsDashboard
);

module.exports = router;