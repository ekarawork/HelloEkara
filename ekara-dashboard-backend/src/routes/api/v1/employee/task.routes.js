"use strict";

const express = require("express");

const router = express.Router();

const {
    employeeTaskController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* =========================================================
   EMPLOYEE TASKS
========================================================= */

/*
   GET /employee/tasks
*/

router.get(
    "/",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.getTasks
);

/*
   GET /employee/tasks/:uuid
*/

router.get(
    "/:uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.getTask
);

/* =========================================================
   EMPLOYEE TASK STATUS
========================================================= */

/*
   PATCH /employee/tasks/:uuid/status
*/

router.patch(
    "/:uuid/status",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.updateTaskStatus
);

/* =========================================================
   EMPLOYEE TASK PROGRESS
========================================================= */

/*
   PATCH /employee/tasks/:uuid/progress
*/

router.patch(
    "/:uuid/progress",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.updateTaskProgress
);

/* =========================================================
   EMPLOYEE TASK MESSAGE SUMMARY
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/latest
*/

router.get(
    "/:uuid/messages/latest",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.getLatestTaskMessage
);

/*
   GET /employee/tasks/:uuid/messages/count
*/

router.get(
    "/:uuid/messages/count",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskController.countTaskMessages
);

module.exports = router;