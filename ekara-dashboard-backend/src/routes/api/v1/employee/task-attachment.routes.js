"use strict";

const express = require("express");

const router = express.Router();

const {
    employeeTaskAttachmentController,
} = require("../../../../controllers/index");

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");

const upload =
    require("../../../../middleware/uploadImage.middleware");

/* =========================================================
   EMPLOYEE TASK ATTACHMENTS
========================================================= */

/*
   POST /employee/tasks/:uuid/attachments
*/

router.post(
    "/tasks/:uuid/attachments",
    authenticate,
    authorize("EMPLOYEE"),
    upload.single("attachment"),
    employeeTaskAttachmentController.createAttachment
);

/*
   GET /employee/tasks/:uuid/attachments
*/

router.get(
    "/tasks/:uuid/attachments",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getAttachments
);

/* =========================================================
   EMPLOYEE DIRECT ATTACHMENTS
========================================================= */

/*
   GET /employee/tasks/:uuid/attachments/direct
*/

router.get(
    "/tasks/:uuid/attachments/direct",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getDirectAttachments
);

/* =========================================================
   EMPLOYEE MESSAGE ATTACHMENTS
========================================================= */

/*
   GET /employee/tasks/:uuid/messages/:message_uuid/attachments
*/

router.get(
    "/tasks/:uuid/messages/:message_uuid/attachments",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getMessageAttachments
);

/*
   GET /employee/tasks/:uuid/messages/:message_uuid/attachments/count
*/

router.get(
    "/tasks/:uuid/messages/:message_uuid/attachments/count",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.countMessageAttachments
);

/* =========================================================
   EMPLOYEE ATTACHMENT DETAILS
========================================================= */

/*
   GET /employee/tasks/:uuid/attachments/:attachment_uuid
*/

router.get(
    "/tasks/:uuid/attachments/:attachment_uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getAttachment
);

/* =========================================================
   EMPLOYEE ATTACHMENT SUMMARY
========================================================= */

/*
   GET /employee/tasks/:uuid/attachments/count
*/

router.get(
    "/tasks/:uuid/attachments/count",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.countAttachments
);

/*
   GET /employee/tasks/:uuid/attachments/latest
*/

router.get(
    "/tasks/:uuid/attachments/latest",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getLatestAttachment
);

/*
   GET /employee/tasks/:uuid/attachments/ids
*/

router.get(
    "/tasks/:uuid/attachments/ids",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.getAttachmentIds
);

/* =========================================================
   EMPLOYEE ATTACHMENT DELETE
========================================================= */

/*
   DELETE /employee/tasks/:uuid/attachments/:attachment_uuid
*/

router.delete(
    "/tasks/:uuid/attachments/:attachment_uuid",
    authenticate,
    authorize("EMPLOYEE"),
    employeeTaskAttachmentController.deleteAttachment
);

module.exports = router;