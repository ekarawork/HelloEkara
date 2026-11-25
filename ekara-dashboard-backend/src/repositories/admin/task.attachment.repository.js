"use strict";

const { Op } = require("sequelize");

const {
    task_attachment,
    task,
    task_message,
    user,
} = require("../../database/models");

/* ========================= Create Task Attachment ========================= */

const createTaskAttachment = async (
    payload,
    transaction = null
) => {
    return await task_attachment.create(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= Find Attachment By ID ========================= */

const findById = async (
    id,
    options = {}
) => {
    return await task_attachment.findByPk(
        id,
        {
            ...options,
        }
    );
};

/* ========================= Find Attachment By UUID ========================= */

const findByUuid = async (
    uuid,
    options = {}
) => {
    return await task_attachment.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/* ========================= Get Attachment Details ========================= */

const getTaskAttachment = async (
    uuid
) => {
    return await task_attachment.findOne({
        where: {
            uuid,
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
            },

            {
                model: task_message,
                as: "message",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "sender_id",
                    "sender_type",
                    "message_type",
                    "createdAt",
                ],
            },

            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
        ],
    });
};

/* ========================= Get Task Attachments ========================= */

const getTaskAttachments = async (
    task_id,
    options = {}
) => {
    return await task_attachment.findAll({
        where: {
            task_id,
        },

        include: [
            {
                model: task_message,
                as: "message",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "sender_id",
                    "sender_type",
                    "message_type",
                    "createdAt",
                ],
            },

            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
        ],

        order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

/* ========================= Get Message Attachments ========================= */

const getMessageAttachments = async (
    message_id,
    options = {}
) => {
    return await task_attachment.findAll({
        where: {
            message_id,
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
                ],
            },

            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
        ],

        order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

/* ========================= Get Direct Task Attachments ========================= */
/*
 * message_id = NULL means the attachment belongs
 * directly to the task and not to a chat message.
 */

const getDirectTaskAttachments = async (
    task_id,
    options = {}
) => {
    return await task_attachment.findAll({
        where: {
            task_id,
            message_id: {
                [Op.is]: null,
            },
        },

        include: [
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
        ],

        order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

/* ========================= Update Task Attachment ========================= */

const updateTaskAttachment = async (
    attachmentData,
    payload,
    transaction = null
) => {
    return await attachmentData.update(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= Delete Task Attachment ========================= */

const deleteTaskAttachment = async (
    attachmentData,
    transaction = null
) => {
    return await attachmentData.destroy({
        transaction,
    });
};

/* ========================= Count Task Attachments ========================= */

const countTaskAttachments = async (
    task_id
) => {
    return await task_attachment.count({
        where: {
            task_id,
        },
    });
};

/* ========================= Count Message Attachments ========================= */

const countMessageAttachments = async (
    message_id
) => {
    return await task_attachment.count({
        where: {
            message_id,
        },
    });
};

/* ========================= Count Direct Task Attachments ========================= */

const countDirectTaskAttachments = async (
    task_id
) => {
    return await task_attachment.count({
        where: {
            task_id,
            message_id: {
                [Op.is]: null,
            },
        },
    });
};

/* ========================= Get Latest Task Attachment ========================= */

const getLatestTaskAttachment = async (
    task_id
) => {
    return await task_attachment.findOne({
        where: {
            task_id,
        },

        include: [
            {
                model: user,
                as: "uploadedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
        ],

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });
};

/* ========================= Find Attachment By Task And Message ========================= */

const findAttachmentByTaskAndMessage = async (
    task_id,
    message_id,
    attachment_id,
    options = {}
) => {
    return await task_attachment.findOne({
        where: {
            id: attachment_id,
            task_id,
            message_id,
        },

        ...options,
    });
};

/* ========================= Find Attachment By Task ========================= */

const findAttachmentByTask = async (
    task_id,
    attachment_id,
    options = {}
) => {
    return await task_attachment.findOne({
        where: {
            id: attachment_id,
            task_id,
        },

        ...options,
    });
};

/* ========================= Find Attachment By Message ========================= */

const findAttachmentByMessage = async (
    message_id,
    attachment_id,
    options = {}
) => {
    return await task_attachment.findOne({
        where: {
            id: attachment_id,
            message_id,
        },

        ...options,
    });
};

/* ========================= Get Attachment IDs ========================= */

const getTaskAttachmentIds = async (
    task_id
) => {
    return await task_attachment.findAll({
        where: {
            task_id,
        },

        attributes: [
            "id",
            "uuid",
        ],

        order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
        ],
    });
};

/* ========================= Export ========================= */

module.exports = {
    createTaskAttachment,

    findById,
    findByUuid,

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

    findAttachmentByTaskAndMessage,
    findAttachmentByTask,
    findAttachmentByMessage,

    getTaskAttachmentIds,
};