"use strict";

const {
    employeeTaskRepository,
    employeeTaskMessageRepository,
    employeeTaskAttachmentRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
    user,
} = require("../../database/models");

const {
    uploadToCloudinary,
    deleteFromCloudinary,
} = require("../../helpers/cloudinary.helper");

const logger = require("../../utils/winston.util");

/* =========================================================
   Constants
   ========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
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
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Sanitize user.
 */
const sanitizeUser = (userData) => {
    if (!userData) {
        return userData;
    }

    const plainUser =
        typeof userData.toJSON === "function"
            ? userData.toJSON()
            : { ...userData };

    delete plainUser.password;
    delete plainUser.reset_password_token;
    delete plainUser.reset_password_expires;

    return plainUser;
};

/**
 * Sanitize attachment.
 */
const sanitizeAttachment = (attachmentData) => {
    if (!attachmentData) {
        return attachmentData;
    }

    const attachment =
        typeof attachmentData.toJSON === "function"
            ? attachmentData.toJSON()
            : { ...attachmentData };

    if (attachment.uploadedBy) {
        attachment.uploadedBy = sanitizeUser(
            attachment.uploadedBy
        );
    }

    if (
        attachment.message &&
        attachment.message.sender
    ) {
        attachment.message.sender = sanitizeUser(
            attachment.message.sender
        );
    }

    return attachment;
};

/**
 * Sanitize attachment list.
 */
const sanitizeAttachments = (attachments = []) => {
    return attachments.map(sanitizeAttachment);
};

/**
 * Validate employee ID.
 */
const validateEmployeeId = (employeeId) => {
    const normalizedEmployeeId = Number(employeeId);

    if (
        !Number.isInteger(normalizedEmployeeId) ||
        normalizedEmployeeId <= 0
    ) {
        throw new ApiError(
            401,
            "Authenticated employee is required."
        );
    }

    return normalizedEmployeeId;
};

/**
 * Validate task UUID.
 */
const validateTaskUuid = (taskUuid) => {
    if (
        !taskUuid ||
        typeof taskUuid !== "string" ||
        !taskUuid.trim()
    ) {
        throw new ApiError(
            400,
            "Task UUID is required."
        );
    }

    return taskUuid.trim();
};

/**
 * Validate attachment UUID.
 */
const validateAttachmentUuid = (attachmentUuid) => {
    if (
        !attachmentUuid ||
        typeof attachmentUuid !== "string" ||
        !attachmentUuid.trim()
    ) {
        throw new ApiError(
            400,
            "Attachment UUID is required."
        );
    }

    return attachmentUuid.trim();
};

/**
 * Validate assigned task.
 */
const getAssignedTask = async (
    taskUuid,
    employeeId,
    options = {}
) => {
    const task = await employeeTaskRepository.getEmployeeTaskDetails(
        taskUuid,
        employeeId,
        options
    );

    if (!task) {
        throw new ApiError(
            404,
            "Task not found or you are not assigned to this task."
        );
    }

    return task;
};

/**
 * Validate uploader.
 */
const validateUploader = async (
    employeeId,
    options = {}
) => {
    const uploader = await user.findOne({
        where: {
            id: employeeId,
            status: "ACTIVE",
        },
        ...options,
    });

    if (!uploader) {
        throw new ApiError(
            401,
            "Authenticated employee account is not active."
        );
    }

    return uploader;
};

/**
 * Validate uploaded file.
 */
const validateFile = (file) => {
    if (!file) {
        throw new ApiError(
            400,
            "Attachment file is required."
        );
    }

    if (!file.buffer) {
        throw new ApiError(
            400,
            "Invalid file buffer."
        );
    }

    if (!file.originalname) {
        throw new ApiError(
            400,
            "Original file name is required."
        );
    }

    if (!file.mimetype) {
        throw new ApiError(
            400,
            "File type is required."
        );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new ApiError(
            400,
            "This file type is not allowed."
        );
    }

    if (
        file.size &&
        file.size > MAX_FILE_SIZE
    ) {
        throw new ApiError(
            400,
            "File size cannot exceed 10 MB."
        );
    }

    return file;
};

/**
 * Get Cloudinary resource type.
 */
const getResourceType = (mimeType) => {
    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    return "raw";
};

/**
 * Extract Cloudinary public ID from upload result.
 */
const getPublicIdFromUploadResult = (uploadResult) => {
    if (!uploadResult) {
        return null;
    }

    return (
        uploadResult.public_id ||
        uploadResult.publicId ||
        null
    );
};

/* =========================================================
   Create Attachment
   ========================================================= */

/**
 * Upload attachment to assigned task.
 *
 * Supported:
 * - Direct task attachment
 * - Message attachment
 */
/* =========================================================
   Create Attachment
   ========================================================= */

/**
 * Upload attachment to assigned task.
 *
 * Supported:
 * - Direct task attachment
 * - Message attachment
 */
const createAttachment = async ({
    taskUuid,
    employeeId,
    messageUuid,
    file,
} = {}) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const normalizedMessageUuid = messageUuid
        ? validateAttachmentUuid(messageUuid)
        : null;

    validateFile(file);

    const transaction = await sequelize.transaction();

    let cloudinaryUploadResult = null;

    try {
        const task = await getAssignedTask(
            normalizedTaskUuid,
            normalizedEmployeeId,
            {
                transaction,
                attributes: ["id", "uuid", "task_code"],
            }
        );

        await validateUploader(
            normalizedEmployeeId,
            {
                transaction,
            }
        );

        let messageId = null;

        if (normalizedMessageUuid) {
            const message =
                await employeeTaskMessageRepository.findByTaskAndUuid(
                    task.id,
                    normalizedMessageUuid,
                    {
                        transaction,
                    }
                );

            if (!message) {
                throw new ApiError(
                    404,
                    "Message not found in this task."
                );
            }

            messageId = message.id;
        }

        const resourceType = getResourceType(
            file.mimetype
        );

        const folder =
            `hello_ekara/tasks/${task.id}`;

        /*
         * IMPORTANT:
         * uploadToCloudinary expects the complete
         * Multer file object, not file.buffer.
         */
        cloudinaryUploadResult =
            await uploadToCloudinary(
                file,
                {
                    folder,
                    resourceType,
                }
            );

        if (!cloudinaryUploadResult) {
            throw new ApiError(
                500,
                "Failed to upload attachment."
            );
        }

        const fileUrl =
            cloudinaryUploadResult.secure_url ||
            cloudinaryUploadResult.url;

        const publicId =
            getPublicIdFromUploadResult(
                cloudinaryUploadResult
            );

        const attachment =
            await employeeTaskAttachmentRepository.createTaskAttachment(
                {
                    task_id: task.id,
                    message_id: messageId,
                    uploaded_by: normalizedEmployeeId,
                    file_url: fileUrl,
                    file_name: file.originalname,
                    file_type: file.mimetype,
                    file_size:
                        file.size ||
                        file.buffer.length,
                    resource_type: resourceType,
                    public_id: publicId,
                },
                {
                    transaction,
                }
            );

        await transaction.commit();

        const savedAttachment =
            await employeeTaskAttachmentRepository.getTaskAttachment(
                task.id,
                attachment.uuid
            );

        return sanitizeAttachment(savedAttachment);
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        /*
         * If DB operation fails after Cloudinary upload,
         * attempt to delete uploaded Cloudinary asset.
         */
        if (cloudinaryUploadResult) {
            const publicId =
                getPublicIdFromUploadResult(
                    cloudinaryUploadResult
                );

            if (publicId) {
                try {
                    await deleteFromCloudinary(
                        publicId,
                        getResourceType(file.mimetype)
                    );
                } catch (cleanupError) {
                    logger.error(
                        "Employee attachment Cloudinary cleanup failed",
                        {
                            publicId,
                            error: cleanupError.message,
                        }
                    );
                }
            }
        }

        logger.error(
            "Employee task attachment creation failed",
            {
                taskUuid: normalizedTaskUuid,
                employeeId: normalizedEmployeeId,
                error: error.message,
            }
        );

        throw error;
    }
};

/* =========================================================
   Get Attachments
   ========================================================= */

/**
 * Get all attachments of assigned task.
 */
const getAttachments = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const attachments =
        await employeeTaskAttachmentRepository.getTaskAttachments(
            task.id
        );

    return sanitizeAttachments(attachments);
};

/**
 * Get direct task attachments.
 */
const getDirectAttachments = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const attachments =
        await employeeTaskAttachmentRepository.getDirectTaskAttachments(
            task.id
        );

    return sanitizeAttachments(attachments);
};

/**
 * Get attachments of a specific message.
 */
const getMessageAttachments = async (
    taskUuid,
    messageUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedMessageUuid = validateAttachmentUuid(
        messageUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const message =
        await employeeTaskMessageRepository.findByTaskAndUuid(
            task.id,
            normalizedMessageUuid
        );

    if (!message) {
        throw new ApiError(
            404,
            "Message not found in this task."
        );
    }

    const attachments =
        await employeeTaskAttachmentRepository.getMessageAttachments(
            task.id,
            message.id
        );

    return sanitizeAttachments(attachments);
};

/**
 * Get single attachment.
 */
const getAttachment = async (
    taskUuid,
    attachmentUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedAttachmentUuid =
        validateAttachmentUuid(attachmentUuid);

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const attachment =
        await employeeTaskAttachmentRepository.getTaskAttachment(
            task.id,
            normalizedAttachmentUuid
        );

    if (!attachment) {
        throw new ApiError(
            404,
            "Attachment not found."
        );
    }

    return sanitizeAttachment(attachment);
};

/* =========================================================
   Delete Own Attachment
   ========================================================= */

/**
 * Employee can delete only their own uploaded attachment.
 */
const deleteAttachment = async (
    taskUuid,
    attachmentUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedAttachmentUuid =
        validateAttachmentUuid(attachmentUuid);

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const attachment =
        await employeeTaskAttachmentRepository.findByTaskAndUuid(
            task.id,
            normalizedAttachmentUuid
        );

    if (!attachment) {
        throw new ApiError(
            404,
            "Attachment not found."
        );
    }

    if (
        Number(attachment.uploaded_by) !==
        normalizedEmployeeId
    ) {
        throw new ApiError(
            403,
            "You can delete only your own attachments."
        );
    }

    await employeeTaskAttachmentRepository.deleteOwnAttachment(
        attachment.id,
        normalizedEmployeeId
    );

    /*
     * Cloudinary cleanup should ideally use the stored
     * public_id field. If your current model does not
     * contain public_id, add it or derive it from file_url.
     */
    if (attachment.public_id) {
        try {
            await deleteFromCloudinary(
                attachment.public_id,
                {
                    resource_type:
                        attachment.resource_type || "raw",
                }
            );
        } catch (cloudinaryError) {
            logger.error(
                "Employee attachment Cloudinary delete failed",
                {
                    attachmentUuid: normalizedAttachmentUuid,
                    error: cloudinaryError.message,
                }
            );
        }
    }

    return {
        message: "Attachment deleted successfully.",
        uuid: normalizedAttachmentUuid,
    };
};

/* =========================================================
   Counts and Latest
   ========================================================= */

/**
 * Count task attachments.
 */
const countAttachments = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    return employeeTaskAttachmentRepository.countTaskAttachments(
        task.id
    );
};

/**
 * Count message attachments.
 */
const countMessageAttachments = async (
    taskUuid,
    messageUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedMessageUuid = validateAttachmentUuid(
        messageUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const message =
        await employeeTaskMessageRepository.findByTaskAndUuid(
            task.id,
            normalizedMessageUuid
        );

    if (!message) {
        throw new ApiError(
            404,
            "Message not found in this task."
        );
    }

    return employeeTaskAttachmentRepository.countMessageAttachments(
        task.id,
        message.id
    );
};

/**
 * Get latest attachment.
 */
const getLatestAttachment = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const attachment =
        await employeeTaskAttachmentRepository.getLatestTaskAttachment(
            task.id
        );

    return sanitizeAttachment(attachment);
};

/**
 * Get attachment IDs.
 */
const getAttachmentIds = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    return employeeTaskAttachmentRepository.getTaskAttachmentIds(
        task.id
    );
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    MAX_FILE_SIZE,
    ALLOWED_MIME_TYPES,

    createAttachment,

    getAttachments,
    getDirectAttachments,
    getMessageAttachments,
    getAttachment,

    deleteAttachment,

    countAttachments,
    countMessageAttachments,
    getLatestAttachment,
    getAttachmentIds,

    sanitizeAttachment,
    sanitizeAttachments,

    validateEmployeeId,
    validateTaskUuid,
    validateAttachmentUuid,
    validateFile,
};