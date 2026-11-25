"use strict";

const express = require("express");
const router = express.Router();
const { clientmetaadsPerformanceController } = require("../../../../controllers/index");
const clientPortalAuthenticate = require("../../../../middleware/clientPortalAuthenticate");

// CLIENT META ADS DASHBOARD
router.get(
    "/meta-ads/dashboard",
    clientPortalAuthenticate,
    clientmetaadsPerformanceController.getMetaAdsDashboard
);

module.exports = router;