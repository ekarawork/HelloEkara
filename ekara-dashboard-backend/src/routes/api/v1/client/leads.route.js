"use strict";

const express = require("express");

const router = express.Router();

const {
    clientLeadsController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate =
    require("../../../../middleware/clientPortalAuthenticate");

/* =========================================================
   CLIENT LEADS DASHBOARD
========================================================= */

router.get(
    "/leads/dashboard",
    clientPortalAuthenticate,
    clientLeadsController.getLeadsDashboard
);

/* =========================================================
   EXPORT
========================================================= */

module.exports = router;