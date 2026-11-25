"use strict";

const asyncHandler = require("../../middleware/asyncHandler");


const ResponseHelper = require("../../helpers/response.helper");


const {
    adminTaskAttachmentService,
} = require("../../services/index");

const {
    createTaskAttachmentSchema,
    updateTaskAttachmentSchema,
    taskAttachmentListSchema,
} = require("../../validations/admin/task.attachment.validation");

/* =========================================================
   Create Task Attachment
========================================================= */

const createTaskAttachment = asyncHandler(
    async (req, res) => {
        const { error, value } =
            createTaskAttachmentSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const taskUuid = req.params.uuid;

        const uploadedBy = req.user?.id;

        if (!uploadedBy) {
            return ResponseHelper.unauthorized(
                res,
                "Unauthorized user."
            );
        }

        if (!req.file) {
            return ResponseHelper.validationError(
                res,
                ["Attachment file is required."]
            );
        }

        const attachment =
            await adminTaskAttachmentService.createTaskAttachment({
                taskUuid,
                messageId: value.message_id || null,
                file: req.file,
                uploadedBy,
            });

        return ResponseHelper.created(
            res,
            attachment,
            "Task attachment uploaded successfully."
        );
    }
);

/* =========================================================
   Get Single Task Attachment
========================================================= */

const getTaskAttachment = asyncHandler(
    async (req, res) => {
        const { attachment_uuid } =
            req.params;

        const attachment =
            await adminTaskAttachmentService
                .getTaskAttachment(
                    attachment_uuid
                );

        return ResponseHelper.success(
            res,
            attachment,
            "Task attachment fetched successfully."
        );
    }
);

/* =========================================================
   Get All Task Attachments
========================================================= */

const getTaskAttachments = asyncHandler(
    async (req, res) => {
        const taskUuid = req.params.uuid;

        const { error, value } =
            taskAttachmentListSchema.validate(
                req.query,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error.details.map(
                    (detail) => detail.message
                )
            );
        }

        const attachments =
            await adminTaskAttachmentService
                .getTaskAttachments(
                    taskUuid,
                    value
                );

        return ResponseHelper.success(
            res,
            attachments,
            "Task attachments fetched successfully."
        );
    }
);

/* =========================================================
   Get Message Attachments
========================================================= */

const getMessageAttachments = asyncHandler(
    async (req, res) => {
        const taskUuid = req.params.uuid;

        const messageId =
            Number(req.params.message_id);

        if (
            !Number.isInteger(messageId) ||
            messageId <= 0
        ) {
            return ResponseHelper.validationError(
                res,
                ["Valid message_id is required."]
            );
        }

        const attachments =
            await adminTaskAttachmentService
                .getMessageAttachments(
                    taskUuid,
                    messageId
                );

        return ResponseHelper.success(
            res,
            attachments,
            "Message attachments fetched successfully."
        );
    }
);

/* =========================================================
   Get Direct Task Attachments
========================================================= */

const getDirectTaskAttachments =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const { error, value } =
                taskAttachmentListSchema.validate(
                    req.query,
                    {
                        abortEarly: false,
                        stripUnknown: true,
                    }
                );

            if (error) {
                return ResponseHelper.validationError(
                    res,
                    error.details.map(
                        (detail) => detail.message
                    )
                );
            }

            const attachments =
                await adminTaskAttachmentService
                    .getDirectTaskAttachments(
                        taskUuid,
                        value
                    );

            return ResponseHelper.success(
                res,
                attachments,
                "Direct task attachments fetched successfully."
            );
        }
    );

/* =========================================================
   Update Task Attachment
========================================================= */

const updateTaskAttachment =
    asyncHandler(
        async (req, res) => {
            const attachmentUuid =
                req.params.attachment_uuid;

            const { error, value } =
                updateTaskAttachmentSchema.validate(
                    req.body,
                    {
                        abortEarly: false,
                        stripUnknown: true,
                    }
                );

            if (error) {
                return ResponseHelper.validationError(
                    res,
                    error.details.map(
                        (detail) => detail.message
                    )
                );
            }

            const uploadedBy =
                req.user?.id;

            if (!uploadedBy) {
                return ResponseHelper.unauthorized(
                    res,
                    "Unauthorized user."
                );
            }

            const attachment =
                await adminTaskAttachmentService
                    .updateTaskAttachment(
                        attachmentUuid,
                        value,
                        uploadedBy
                    );

            return ResponseHelper.success(
                res,
                attachment,
                "Task attachment updated successfully."
            );
        }
    );

/* =========================================================
   Delete Task Attachment
========================================================= */

const deleteTaskAttachment =
    asyncHandler(
        async (req, res) => {
            const attachmentUuid =
                req.params.attachment_uuid;

            const uploadedBy =
                req.user?.id;

            if (!uploadedBy) {
                return ResponseHelper.unauthorized(
                    res,
                    "Unauthorized user."
                );
            }

            const result =
                await adminTaskAttachmentService
                    .deleteTaskAttachment(
                        attachmentUuid,
                        uploadedBy
                    );

            return ResponseHelper.success(
                res,
                result,
                "Task attachment deleted successfully."
            );
        }
    );

/* =========================================================
   Count Task Attachments
========================================================= */

const countTaskAttachments =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const count =
                await adminTaskAttachmentService
                    .countTaskAttachments(
                        taskUuid
                    );

            return ResponseHelper.success(
                res,
                {
                    count,
                },
                "Task attachment count fetched successfully."
            );
        }
    );

/* =========================================================
   Count Message Attachments
========================================================= */

const countMessageAttachments =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const messageId =
                Number(req.params.message_id);

            if (
                !Number.isInteger(messageId) ||
                messageId <= 0
            ) {
                return ResponseHelper.validationError(
                    res,
                    ["Valid message_id is required."]
                );
            }

            const count =
                await adminTaskAttachmentService
                    .countMessageAttachments(
                        taskUuid,
                        messageId
                    );

            return ResponseHelper.success(
                res,
                {
                    count,
                },
                "Message attachment count fetched successfully."
            );
        }
    );

/* =========================================================
   Count Direct Task Attachments
========================================================= */

const countDirectTaskAttachments =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const count =
                await adminTaskAttachmentService
                    .countDirectTaskAttachments(
                        taskUuid
                    );

            return ResponseHelper.success(
                res,
                {
                    count,
                },
                "Direct task attachment count fetched successfully."
            );
        }
    );

/* =========================================================
   Get Latest Task Attachment
========================================================= */

const getLatestTaskAttachment =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const attachment =
                await adminTaskAttachmentService
                    .getLatestTaskAttachment(
                        taskUuid
                    );

            return ResponseHelper.success(
                res,
                attachment,
                "Latest task attachment fetched successfully."
            );
        }
    );

/* =========================================================
   Get Task Attachment IDs
========================================================= */

const getTaskAttachmentIds =
    asyncHandler(
        async (req, res) => {
            const taskUuid =
                req.params.uuid;

            const attachments =
                await adminTaskAttachmentService
                    .getTaskAttachmentIds(
                        taskUuid
                    );

            return ResponseHelper.success(
                res,
                attachments,
                "Task attachment IDs fetched successfully."
            );
        }
    );

/* =========================================================
   Exports
========================================================= */

module.exports = {
    createTaskAttachment,

    getTaskAttachment,
    getTaskAttachments,
    getMessageAttachments,
    getDirectTaskAttachments,

    updateTaskAttachment,
    deleteTaskAttachment,

    countTaskAttachments,
    countMessageAttachments,
    countDirectTaskAttachments,

    getLatestTaskAttachment,
    getTaskAttachmentIds,
};