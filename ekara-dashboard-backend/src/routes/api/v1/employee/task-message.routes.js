"use strict";

const express = require("express");

const router = express.Router();

const {
    employeeTaskMessageController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

/* =========================================================
   EMPLOYEE TASK MESSAGES
========================================================= */

/*
   POST /employee/tasks/:uuid/messages
*/

router.post(
    "/tasks/:uuid/messages",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.createMessage
);

/*
   GET /employee/tasks/:uuid/messages
*/

router.get(
    "/tasks/:uuid/messages",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getMessages
);

/*
   GET /employee/tasks/:uuid/messages/all
*/

router.get(
    "/tasks/:uuid/messages/all",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getAllMessages
);

/* =========================================================
   EMPLOYEE TASK MESSAGE DETAILS
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/:message_uuid
*/

router.get(
    "/tasks/:uuid/messages/:message_uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getMessage
);

/* =========================================================
   EMPLOYEE TASK MESSAGE LATEST
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/latest
*/

router.get(
    "/tasks/:uuid/messages/latest",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getLatestMessage
);

/*
   GET /employee/tasks/:uuid/messages/latest-list
*/

router.get(
    "/tasks/:uuid/messages/latest-list",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getLatestMessages
);

/* =========================================================
   EMPLOYEE TASK MESSAGE COUNT
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/count
*/

router.get(
    "/tasks/:uuid/messages/count",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.countMessages
);

/*
   GET /employee/tasks/:uuid/messages/count-by-type
*/

router.get(
    "/tasks/:uuid/messages/count-by-type",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.countMessagesByType
);

/* =========================================================
   EMPLOYEE TASK MESSAGE IDS
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/ids
*/

router.get(
    "/tasks/:uuid/messages/ids",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.getMessageIds
);

/* =========================================================
   EMPLOYEE TASK MESSAGE UPDATE
========================================================= */

/*
   PATCH /employee/tasks/:uuid/messages/:message_uuid
*/

router.patch(
    "/tasks/:uuid/messages/:message_uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.updateMessage
);

/* =========================================================
   EMPLOYEE TASK MESSAGE DELETE
========================================================= */

/*
   DELETE /employee/tasks/:uuid/messages/:message_uuid
*/

router.delete(
    "/tasks/:uuid/messages/:message_uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskMessageController.deleteMessage
);

module.exports = router;