"use strict";

const express = require("express");

const router = express.Router();

const {
    adminDashboardController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET ADMIN DASHBOARD
========================================================= */

router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminDashboardController.getDashboardData
);

module.exports = router;