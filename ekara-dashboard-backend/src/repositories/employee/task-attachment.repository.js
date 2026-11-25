"use strict";

const {
    task_attachment,
    task,
    task_message,
    user,
} = require("../../database/models");

/* =========================================================
   Employee Task Attachment Repository
   ========================================================= */

/* =========================================================
   Create
   ========================================================= */

/**
 * Create task attachment.
 *
 * Uploading file to Cloudinary will be handled by service.
 * This repository only stores database record.
 */
const createTaskAttachment = async (
    data,
    options = {}
) => {
    return task_attachment.create(
        data,
        options
    );
};

/* =========================================================
   Find
   ========================================================= */

/**
 * Find attachment by primary ID.
 */
const findById = async (
    id,
    options = {}
) => {
    return task_attachment.findByPk(
        id,
        options
    );
};

/**
 * Find attachment by UUID.
 */
const findByUuid = async (
    uuid,
    options = {}
) => {
    return task_attachment.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/**
 * Find attachment by task and attachment UUID.
 *
 * This prevents attachment access across different tasks.
 */
const findByTaskAndUuid = async (
    taskId,
    uuid,
    options = {}
) => {
    return task_attachment.findOne({
        where: {
            task_id: taskId,
            uuid,
        },
        ...options,
    });
};

/* =========================================================
   Attachment Details
   ========================================================= */

/**
 * Get attachment details.
 */
const getTaskAttachment = async (
    taskId,
    attachmentUuid,
    options = {}
) => {
    return task_attachment.findOne({
        ...options,
        where: {
            ...(options.where || {}),
            task_id: taskId,
            uuid: attachmentUuid,
        },
        include: [
            {
                model: task,
                as: "task",
                attributes: [
                    "id",
                    "uuid",
                    "task_code",
                    "title",
                    "status",
                ],
                required: false,
            },
            {
                model: task_message,
                as: "message",
                attributes: [
                    "id",
                    "uuid",
                    "task_id",
                    "sender_id",
                    "sender_type",
                    "message",
                    "message_type",
                    "createdAt",
                ],
                required: false,
            },
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
        ],
    });
};

/* =========================================================
   Task Attachments
   ========================================================= */

/**
 * Get all attachments of an assigned task.
 */
const getTaskAttachments = async (
    taskId,
    options = {}
) => {
    return task_attachment.findAll({
        where: {
            task_id: taskId,
        },
        include: [
            {
                model: task_message,
                as: "message",
                attributes: [
                    "id",
                    "uuid",
                    "task_id",
                    "sender_id",
                    "sender_type",
                    "message",
                    "message_type",
                    "createdAt",
                ],
                required: false,
            },
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
        ],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/**
 * Get attachments of a specific message.
 */
const getMessageAttachments = async (
    taskId,
    messageId,
    options = {}
) => {
    return task_attachment.findAll({
        where: {
            task_id: taskId,
            message_id: messageId,
        },
        include: [
            {
                model: task_message,
                as: "message",
                attributes: [
                    "id",
                    "uuid",
                    "task_id",
                    "sender_id",
                    "sender_type",
                    "message",
                    "message_type",
                    "createdAt",
                ],
                required: false,
            },
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
        ],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/**
 * Get direct task attachments.
 *
 * Direct attachment means message_id is null.
 */
const getDirectTaskAttachments = async (
    taskId,
    options = {}
) => {
    return task_attachment.findAll({
        where: {
            task_id: taskId,
            message_id: null,
        },
        include: [
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
        ],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/* =========================================================
   Update
   ========================================================= */

/**
 * Update attachment metadata.
 *
 * Employee service must validate uploader ownership.
 */
const updateAttachment = async (
    attachmentId,
    data,
    options = {}
) => {
    const [updatedCount] = await task_attachment.update(
        data,
        {
            where: {
                id: attachmentId,
            },
            ...options,
        }
    );

    return updatedCount;
};

/**
 * Update only attachment uploaded by employee.
 */
const updateOwnAttachment = async (
    attachmentId,
    uploadedBy,
    data,
    options = {}
) => {
    const [updatedCount] = await task_attachment.update(
        data,
        {
            where: {
                id: attachmentId,
                uploaded_by: uploadedBy,
            },
            ...options,
        }
    );

    return updatedCount;
};

/* =========================================================
   Delete
   ========================================================= */

/**
 * Delete attachment record.
 *
 * Cloudinary deletion will be handled by service.
 */
const deleteAttachment = async (
    attachmentId,
    options = {}
) => {
    return task_attachment.destroy({
        where: {
            id: attachmentId,
        },
        ...options,
    });
};

/**
 * Delete only attachment uploaded by employee.
 */
const deleteOwnAttachment = async (
    attachmentId,
    uploadedBy,
    options = {}
) => {
    return task_attachment.destroy({
        where: {
            id: attachmentId,
            uploaded_by: uploadedBy,
        },
        ...options,
    });
};

/* =========================================================
   Counts
   ========================================================= */

/**
 * Count all attachments of a task.
 */
const countTaskAttachments = async (
    taskId,
    options = {}
) => {
    return task_attachment.count({
        where: {
            task_id: taskId,
        },
        ...options,
    });
};

/**
 * Count attachments of a message.
 */
const countMessageAttachments = async (
    taskId,
    messageId,
    options = {}
) => {
    return task_attachment.count({
        where: {
            task_id: taskId,
            message_id: messageId,
        },
        ...options,
    });
};

/* =========================================================
   Latest
   ========================================================= */

/**
 * Get latest attachment of a task.
 */
const getLatestTaskAttachment = async (
    taskId,
    options = {}
) => {
    return task_attachment.findOne({
        where: {
            task_id: taskId,
        },
        include: [
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
        ],
        order: [["createdAt", "DESC"]],
        ...options,
    });
};

/**
 * Get attachment IDs of a task.
 */
const getTaskAttachmentIds = async (
    taskId,
    options = {}
) => {
    return task_attachment.findAll({
        where: {
            task_id: taskId,
        },
        attributes: ["id", "uuid"],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/* =========================================================
   Search Helpers
   ========================================================= */

/**
 * Find attachment by task and message.
 */
const findByTaskAndMessage = async (
    taskId,
    messageId,
    options = {}
) => {
    return task_attachment.findOne({
        where: {
            task_id: taskId,
            message_id: messageId,
        },
        ...options,
    });
};

/**
 * Find attachment by task, message and uploader.
 */
const findByTaskMessageAndUploader = async (
    taskId,
    messageId,
    uploadedBy,
    options = {}
) => {
    return task_attachment.findOne({
        where: {
            task_id: taskId,
            message_id: messageId,
            uploaded_by: uploadedBy,
        },
        ...options,
    });
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    createTaskAttachment,

    findById,
    findByUuid,
    findByTaskAndUuid,

    getTaskAttachment,
    getTaskAttachments,
    getMessageAttachments,
    getDirectTaskAttachments,

    updateAttachment,
    updateOwnAttachment,

    deleteAttachment,
    deleteOwnAttachment,

    countTaskAttachments,
    countMessageAttachments,

    getLatestTaskAttachment,
    getTaskAttachmentIds,

    findByTaskAndMessage,
    findByTaskMessageAndUploader,
};