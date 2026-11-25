"use strict";

const {
    adminTaskAttachmentRepository,
    adminTaskRepository,
} = require("../../repositories/index");

const {
    uploadToCloudinary,
    deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const {
    sequelize,
} = require("../../database/models");
const {
    task_message,
} = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   Constants
========================================================= */

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/plain",

    // Video
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/* =========================================================
   Helpers
========================================================= */

/**
 * Remove sensitive user information from uploadedBy
 */
const sanitizeUser = (userData) => {
    if (!userData) {
        return null;
    }

    const user =
        typeof userData.toJSON === "function"
            ? userData.toJSON()
            : { ...userData };

    delete user.password;
    delete user.reset_password_token;
    delete user.reset_password_expires;

    return user;
};

/**
 * Sanitize attachment response
 */
const sanitizeAttachment = (attachment) => {
    if (!attachment) {
        return null;
    }

    const data =
        typeof attachment.toJSON === "function"
            ? attachment.toJSON()
            : { ...attachment };

    if (data.uploadedBy) {
        data.uploadedBy = sanitizeUser(data.uploadedBy);
    }

    if (data.message?.sender) {
        data.message.sender = sanitizeUser(data.message.sender);
    }

    return data;
};

const sanitizeAttachments = (attachments = []) => {
    return attachments.map(sanitizeAttachment);
};

/**
 * Validate task
 */
const validateTask = async (taskUuid, options = {}) => {
    const task = await adminTaskRepository.findByUuid(
        taskUuid,
        options
    );

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    return task;
};

/**
 * Validate message belongs to task
 */
const validateMessage = async (
    taskId,
    messageId,
    options = {}
) => {
    const message = await task_message.findOne({
        where: {
            id: messageId,
            task_id: taskId,
        },
        ...options,
    });

    if (!message) {
        throw new ApiError(
            404,
            "Task message not found."
        );
    }

    return message;
};

/**
 * Validate uploader
 */
const validateUploader = async (
    uploaderId,
    options = {}
) => {
    const user = await adminTaskRepository.findUserById(
        uploaderId,
        options
    );

    if (!user) {
        throw new ApiError(
            404,
            "Uploader user not found."
        );
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "Inactive users cannot upload attachments."
        );
    }

    return user;
};

/**
 * Validate uploaded file
 */
const validateFile = (file) => {
    if (!file) {
        throw new ApiError(
            400,
            "Attachment file is required."
        );
    }

    if (!file.mimetype) {
        throw new ApiError(
            400,
            "Invalid file type."
        );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        throw new ApiError(
            400,
            "Unsupported file type."
        );
    }

    if (file.size && file.size > MAX_FILE_SIZE) {
        throw new ApiError(
            400,
            "File size cannot exceed 10 MB."
        );
    }

    if (!file.originalname) {
        throw new ApiError(
            400,
            "File name is required."
        );
    }

    if (
        !file.buffer ||
        !Buffer.isBuffer(file.buffer) ||
        file.buffer.length === 0
    ) {
        throw new ApiError(
            400,
            "Uploaded file data is empty."
        );
    }

    return true;
};

/**
 * Detect Cloudinary resource type
 */
const getResourceType = (mimetype) => {
    if (mimetype.startsWith("image/")) {
        return "image";
    }

    if (mimetype.startsWith("video/")) {
        return "video";
    }

    if (mimetype === "application/pdf") {
        return "raw";
    }

    if (
        mimetype.includes("word") ||
        mimetype.includes("excel") ||
        mimetype === "text/plain"
    ) {
        return "raw";
    }

    return "raw";
};

/* =========================================================
   Create Task Attachment
========================================================= */

const createTaskAttachment = async ({
    taskUuid,
    messageId = null,
    file,
    uploadedBy,
}) => {
    validateFile(file);

    const transaction = await sequelize.transaction();

    let uploadedFile = null;

    try {
        const task = await validateTask(
            taskUuid,
            { transaction }
        );

        await validateUploader(
            uploadedBy,
            { transaction }
        );

        /*
         * If attachment belongs to a chat message,
         * make sure that message belongs to this task.
         */
        if (messageId) {
            await validateMessage(
                task.id,
                messageId,
                { transaction }
            );
        }

        const resourceType = getResourceType(
            file.mimetype
        );

        uploadedFile = await uploadToCloudinary(file, {
            folder: `hello_ekara/tasks/${task.id}`,
            resourceType,
        });

        if (!uploadedFile) {
            throw new ApiError(
                500,
                "Failed to upload attachment."
            );
        }

        const attachment =
            await adminTaskAttachmentRepository.createTaskAttachment(
                {
                    task_id: task.id,
                    message_id: messageId || null,
                    uploaded_by: uploadedBy,
                    file_url:
                        uploadedFile.secure_url ||
                        uploadedFile.url,
                    file_name: file.originalname,
                    file_type: file.mimetype,
                    file_size: file.size || null,
                    resource_type:
                        uploadedFile.resource_type ||
                        resourceType,
                },
                transaction
            );

        await transaction.commit();

        return sanitizeAttachment(
            attachment
        );
    } catch (error) {
        await transaction.rollback();

        /*
         * Database transaction can rollback, but the Cloudinary
         * upload has already happened. Try to remove it so that
         * orphan files are not left behind.
         */
        if (uploadedFile?.secure_url) {
            try {
                await deleteCloudinaryFile(
                    uploadedFile.secure_url,
                    uploadedFile.resource_type || resourceType
                );
            } catch (cleanupError) {
                logger.error(
                    "Failed to cleanup Cloudinary task attachment:",
                    cleanupError
                );
            }
        }

        logger.error(
            "Create task attachment error:",
            error
        );

        throw error;
    }
};

/* =========================================================
   Get Single Attachment
========================================================= */

const getTaskAttachment = async (uuid) => {
    const attachment =
        await adminTaskAttachmentRepository.getTaskAttachment(
            uuid
        );

    if (!attachment) {
        throw new ApiError(
            404,
            "Task attachment not found."
        );
    }

    return sanitizeAttachment(
        attachment
    );
};

/* =========================================================
   Get Task Attachments
========================================================= */

const getTaskAttachments = async (
    taskUuid,
    options = {}
) => {
    const task = await validateTask(
        taskUuid
    );

    const attachments =
        await adminTaskAttachmentRepository.getTaskAttachments(
            task.id,
            options
        );

    return sanitizeAttachments(
        attachments
    );
};

/* =========================================================
   Get Message Attachments
========================================================= */

const getMessageAttachments = async (
    taskUuid,
    messageId,
    options = {}
) => {
    const task = await validateTask(
        taskUuid
    );

    await validateMessage(
        task.id,
        messageId
    );

    const attachments =
        await adminTaskAttachmentRepository.getMessageAttachments(
            messageId,
            options
        );

    return sanitizeAttachments(
        attachments
    );
};

/* =========================================================
   Get Direct Task Attachments
========================================================= */

const getDirectTaskAttachments = async (
    taskUuid,
    options = {}
) => {
    const task = await validateTask(
        taskUuid
    );

    const attachments =
        await adminTaskAttachmentRepository.getDirectTaskAttachments(
            task.id,
            options
        );

    return sanitizeAttachments(
        attachments
    );
};

/* =========================================================
   Update Attachment
========================================================= */

const updateTaskAttachment = async (
    uuid,
    payload,
    uploadedBy
) => {
    const attachment =
        await adminTaskAttachmentRepository.findByUuid(
            uuid
        );

    if (!attachment) {
        throw new ApiError(
            404,
            "Task attachment not found."
        );
    }

    if (
        Number(attachment.uploaded_by) !==
        Number(uploadedBy)
    ) {
        throw new ApiError(
            403,
            "You can only update your own attachment."
        );
    }

    /*
     * Normally only metadata should be updated here.
     * Actual file replacement can be handled separately.
     */
    const allowedFields = {};

    if (payload.file_name !== undefined) {
        allowedFields.file_name =
            payload.file_name;
    }

    if (payload.file_type !== undefined) {
        allowedFields.file_type =
            payload.file_type;
    }

    if (Object.keys(allowedFields).length === 0) {
        return sanitizeAttachment(
            attachment
        );
    }

    await attachment.update(
        allowedFields
    );

    return sanitizeAttachment(
        attachment
    );
};

/* =========================================================
   Delete Attachment
========================================================= */

const deleteTaskAttachment = async (
    uuid,
    uploadedBy
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const attachment =
            await adminTaskAttachmentRepository.findByUuid(
                uuid,
                { transaction }
            );

        if (!attachment) {
            throw new ApiError(
                404,
                "Task attachment not found."
            );
        }

        if (
            Number(attachment.uploaded_by) !==
            Number(uploadedBy)
        ) {
            throw new ApiError(
                403,
                "You can only delete your own attachment."
            );
        }

        const fileUrl = attachment.file_url;
        const resourceType =
            attachment.resource_type || "image";

        await adminTaskAttachmentRepository.deleteTaskAttachment(
            attachment,
            transaction
        );

        await transaction.commit();

        /*
        * Delete file from Cloudinary after
        * successful database deletion.
        */
        if (fileUrl) {
            try {
                await deleteCloudinaryFile(
                    fileUrl,
                    resourceType
                );
            } catch (cleanupError) {
                logger.error(
                    "Cloudinary task attachment cleanup failed:",
                    cleanupError
                );
            }
        }

        return {
            success: true,
            message:
                "Task attachment deleted successfully.",
        };
    } catch (error) {
        await transaction.rollback();

        logger.error(
            "Delete task attachment error:",
            error
        );

        throw error;
    }
};

/* =========================================================
   Counts
========================================================= */

const countTaskAttachments = async (
    taskUuid
) => {
    const task = await validateTask(
        taskUuid
    );

    return adminTaskAttachmentRepository
        .countTaskAttachments(task.id);
};

const countMessageAttachments = async (
    taskUuid,
    messageId
) => {
    const task = await validateTask(
        taskUuid
    );

    await validateMessage(
        task.id,
        messageId
    );

    return adminTaskAttachmentRepository
        .countMessageAttachments(
            messageId
        );
};

const countDirectTaskAttachments = async (
    taskUuid
) => {
    const task = await validateTask(
        taskUuid
    );

    return adminTaskAttachmentRepository
        .countDirectTaskAttachments(
            task.id
        );
};

/* =========================================================
   Latest Attachment
========================================================= */

const getLatestTaskAttachment = async (
    taskUuid
) => {
    const task = await validateTask(
        taskUuid
    );

    const attachment =
        await adminTaskAttachmentRepository
            .getLatestTaskAttachment(
                task.id
            );

    return sanitizeAttachment(
        attachment
    );
};

/* =========================================================
   Attachment IDs
========================================================= */

const getTaskAttachmentIds = async (
    taskUuid
) => {
    const task = await validateTask(
        taskUuid
    );

    return adminTaskAttachmentRepository
        .getTaskAttachmentIds(
            task.id
        );
};

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

    validateFile,
};