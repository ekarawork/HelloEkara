"use strict";

const express = require("express");

const router = express.Router();

const {
    clientSocialCalendarController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate =
    require("../../../../middleware/clientPortalAuthenticate");

/* ========================= Social Calendar Dashboard ========================= */

router.get(
    "/social-calendar/dashboard",
    clientPortalAuthenticate,
    clientSocialCalendarController.getSocialCalendarDashboard
);

/* ========================= Export ========================= */

module.exports = router;