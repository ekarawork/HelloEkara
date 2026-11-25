"use strict";

const express = require("express");

const router = express.Router();

const {
    employeeDashboardController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* =========================================================
   EMPLOYEE DASHBOARD
========================================================= */

/*
   GET /employee/dashboard

   Returns:
   - Task summary
   - Recent assigned tasks
   - Upcoming deadlines
   - Overdue tasks
   - Task status overview
*/

router.get(
    "/",
    authenticate,
    authorize("EMPLOYEE"),
    employeeDashboardController.getDashboard
);

module.exports = router;