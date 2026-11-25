"use strict";

const express = require("express");

const router = express.Router();

const {
    adminTaskMessageController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* ========================= Create Task Message ========================= */

router.post(
    "/:uuid/messages",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.createTaskMessage
);

/* ========================= Get Task Messages ========================= */

router.get(
    "/:uuid/messages",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.getTaskMessages
);

/* ========================= Get All Task Messages ========================= */

router.get(
    "/:uuid/messages/all",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.getAllTaskMessages
);

/* ========================= Get Latest Task Message ========================= */

router.get(
    "/:uuid/messages/latest",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.getLatestTaskMessage
);

/* ========================= Get Latest Task Messages ========================= */

router.get(
    "/:uuid/messages/latest/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.getLatestTaskMessages
);

/* ========================= Count Task Messages ========================= */

router.get(
    "/:uuid/messages/count",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.countTaskMessages
);

/* ========================= Count Task Messages By Type ========================= */

router.get(
    "/:uuid/messages/count/type",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.countTaskMessagesByType
);

/* ========================= Get Task Message Details ========================= */

router.get(
    "/:uuid/messages/:message_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.getTaskMessage
);

/* ========================= Update Task Message ========================= */

router.patch(
    "/:uuid/messages/:message_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.updateTaskMessage
);

/* ========================= Delete Task Message ========================= */

router.delete(
    "/:uuid/messages/:message_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskMessageController.deleteTaskMessage
);

module.exports = router;