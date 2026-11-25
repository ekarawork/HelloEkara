"use strict";

const express = require("express");

const router = express.Router();

const authenticate =
    require("../../../../middleware/authenticate");

const authorize =
    require("../../../../middleware/authorize");
const upload =
    require("../../../../middleware/uploadImage.middleware");

const {
    adminTaskAttachmentController,
} = require("../../../../controllers/index");

/* =========================================================
   Admin Task Attachment Routes
========================================================= */

/*
 * Create / Upload Attachment
 *
 * POST
 * /admin/task/:uuid/attachments
 *
 * Form-data:
 * attachment -> file
 * message_id -> optional
 */
router.post(
    "/:uuid/attachments",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    upload.single("attachment"),
    adminTaskAttachmentController.createTaskAttachment
);

/*
 * Get All Task Attachments
 *
 * GET
 * /admin/task/:uuid/attachments
 */
router.get(
    "/:uuid/attachments",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getTaskAttachments
);

/*
 * Get Direct Task Attachments
 *
 * GET
 * /admin/task/:uuid/attachments/direct
 */
router.get(
    "/:uuid/attachments/direct",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getDirectTaskAttachments
);

/*
 * Get Message Attachments
 *
 * GET
 * /admin/task/:uuid/attachments/message/:message_id
 */
router.get(
    "/:uuid/attachments/message/:message_id",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getMessageAttachments
);

/*
 * Count All Task Attachments
 *
 * GET
 * /admin/task/:uuid/attachments/count
 */
router.get(
    "/:uuid/attachments/count",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.countTaskAttachments
);

/*
 * Count Direct Task Attachments
 *
 * GET
 * /admin/task/:uuid/attachments/count/direct
 */
router.get(
    "/:uuid/attachments/count/direct",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.countDirectTaskAttachments
);

/*
 * Count Message Attachments
 *
 * GET
 * /admin/task/:uuid/attachments/count/message/:message_id
 */
router.get(
    "/:uuid/attachments/count/message/:message_id",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.countMessageAttachments
);

/*
 * Get Latest Task Attachment
 *
 * GET
 * /admin/task/:uuid/attachments/latest
 */
router.get(
    "/:uuid/attachments/latest",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getLatestTaskAttachment
);

/*
 * Get Task Attachment IDs
 *
 * GET
 * /admin/task/:uuid/attachments/ids
 */
router.get(
    "/:uuid/attachments/ids",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getTaskAttachmentIds
);

/*
 * Get Single Attachment
 *
 * GET
 * /admin/task/:uuid/attachments/:attachment_uuid
 */
router.get(
    "/:uuid/attachments/:attachment_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.getTaskAttachment
);

/*
 * Update Attachment Metadata
 *
 * PATCH
 * /admin/task/:uuid/attachments/:attachment_uuid
 */
router.patch(
    "/:uuid/attachments/:attachment_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.updateTaskAttachment
);

/*
 * Delete Attachment
 *
 * DELETE
 * /admin/task/:uuid/attachments/:attachment_uuid
 */
router.delete(
    "/:uuid/attachments/:attachment_uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminTaskAttachmentController.deleteTaskAttachment
);

/* =========================================================
   Export
========================================================= */

module.exports = router;