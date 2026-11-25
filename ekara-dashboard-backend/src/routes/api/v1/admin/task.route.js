"use strict";

const express = require("express");

const router = express.Router();

const {
    adminTaskController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* ========================= Create Task ========================= */

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.createTask
);

/* ========================= Get Tasks ========================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.getTasks
);

/* ========================= Get Task Details ========================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.getTask
);

/* ========================= Update Task ========================= */

router.patch(
    "/update/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.updateTask
);

/* ========================= Update Task Priority ========================= */

router.patch(
    "/priority/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.updateTaskPriority
);

/* ========================= Update Task Status ========================= */

router.patch(
    "/status/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.updateTaskStatus
);

/* ========================= Soft Delete Task ========================= */

router.delete(
    "/trash/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.deleteTask
);

/* ========================= Restore Task ========================= */

router.patch(
    "/restore/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.restoreTask
);

/* ========================= Force Delete Task ========================= */

router.delete(
    "/force-delete/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.forceDeleteTask
);

/* ========================= Get Trash Tasks ========================= */

router.get(
    "/trash",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.getTrashTasks
);

/* ========================= Add Task Assignment ========================= */

router.post(
    "/:uuid/assign",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.addTaskAssignment
);

/* ========================= Remove Task Assignment ========================= */

router.delete(
    "/:uuid/assign/:employee_id",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.removeTaskAssignment
);

/* ========================= Get Task Assignments ========================= */

router.get(
    "/:uuid/assignments",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskController.getTaskAssignments
);

module.exports = router;