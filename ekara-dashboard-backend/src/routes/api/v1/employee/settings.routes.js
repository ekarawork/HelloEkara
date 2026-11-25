"use strict";

const express = require("express");

const router = express.Router();

const {
    employeeSettingsController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* =========================================================
   EMPLOYEE PROFILE
========================================================= */

/*
   GET /employee/settings/profile
*/

router.get(
    "/profile",
    authenticate,
    authorize("EMPLOYEE"),
    employeeSettingsController.getEmployeeProfile
);

/*
   PUT /employee/settings/profile
*/

router.put(
    "/profile",
    authenticate,
    authorize("EMPLOYEE"),
    employeeSettingsController.updateEmployeeProfile
);

/* =========================================================
   EMPLOYEE SECURITY
========================================================= */

/*
   PUT /employee/settings/change-password
*/

router.put(
    "/change-password",
    authenticate,
    authorize("EMPLOYEE"),
    employeeSettingsController.changeEmployeePassword
);

module.exports = router;