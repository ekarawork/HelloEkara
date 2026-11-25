"use strict";

const {
    task_message,
    task,
    user,
    task_attachment,
} = require("../../database/models");

const {
    Op,
    fn,
    col,
} = require("sequelize");

/* =========================================================
   Employee Task Message Repository
   ========================================================= */

/* =========================================================
   Create
   ========================================================= */

/**
 * Create a task message.
 *
 * Employee service sender_id and sender_type validate karegi.
 */
const createTaskMessage = async (
    data,
    options = {}
) => {
    return task_message.create(
        data,
        options
    );
};

/* =========================================================
   Find
   ========================================================= */

/**
 * Find message by primary ID.
 */
const findById = async (
    id,
    options = {}
) => {
    return task_message.findByPk(
        id,
        options
    );
};

/**
 * Find message by UUID.
 */
const findByUuid = async (
    uuid,
    options = {}
) => {
    return task_message.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/**
 * Find message by UUID and task ID.
 *
 * This prevents accessing a message from another task.
 */
const findByTaskAndUuid = async (
    taskId,
    uuid,
    options = {}
) => {
    return task_message.findOne({
        where: {
            task_id: taskId,
            uuid,
        },
        ...options,
    });
};

/* =========================================================
   Message Details
   ========================================================= */

/**
 * Get message details with sender and attachments.
 */
const getTaskMessage = async (
    taskId,
    messageUuid,
    options = {}
) => {
    return task_message.findOne({
        ...options,
        where: {
            ...(options.where || {}),
            task_id: taskId,
            uuid: messageUuid,
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
                    "priority",
                ],
                required: false,
            },
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],
    });
};

/* =========================================================
   Message List
   ========================================================= */

/**
 * Get task messages with pagination.
 */
const getTaskMessages = async ({
    taskId,
    page = 1,
    limit = 50,
    search,
    messageType,
} = {}) => {
    const offset = (page - 1) * limit;

    const where = {
        task_id: taskId,
    };

    if (messageType) {
        where.message_type = messageType;
    }

    if (search) {
        where.message = {
            [Op.like]: `%${search}%`,
        };
    }

    const result = await task_message.findAndCountAll({
        where,
        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],
        distinct: true,
        limit,
        offset,
        order: [["createdAt", "ASC"]],
    });

    return {
        rows: result.rows,
        count: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit),
    };
};

/**
 * Get all messages of a task without pagination.
 */
const getAllTaskMessages = async (
    taskId,
    options = {}
) => {
    return task_message.findAll({
        where: {
            task_id: taskId,
        },
        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/* =========================================================
   Latest Messages
   ========================================================= */

/**
 * Get latest single message.
 */
const getLatestMessage = async (
    taskId,
    options = {}
) => {
    return task_message.findOne({
        where: {
            task_id: taskId,
        },
        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],
        order: [["createdAt", "DESC"]],
        ...options,
    });
};

/**
 * Get latest N messages.
 */
const getLatestMessages = async (
    taskId,
    limit = 10,
    options = {}
) => {
    const messages = await task_message.findAll({
        where: {
            task_id: taskId,
        },
        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
                required: false,
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        ...options,
    });

    return messages.reverse();
};

/* =========================================================
   Update
   ========================================================= */

/**
 * Update a message.
 *
 * Employee service must ensure that only the sender's
 * own message is updated.
 */
const updateMessage = async (
    messageId,
    data,
    options = {}
) => {
    const [updatedCount] = await task_message.update(
        data,
        {
            where: {
                id: messageId,
            },
            ...options,
        }
    );

    return updatedCount;
};

/**
 * Update only employee's own message.
 */
const updateOwnMessage = async (
    messageId,
    senderId,
    data,
    options = {}
) => {
    const [updatedCount] = await task_message.update(
        data,
        {
            where: {
                id: messageId,
                sender_id: senderId,
                sender_type: "EMPLOYEE",
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
 * Delete a message.
 *
 * Employee service must ensure ownership before calling.
 */
const deleteMessage = async (
    messageId,
    options = {}
) => {
    return task_message.destroy({
        where: {
            id: messageId,
        },
        ...options,
    });
};

/**
 * Delete only employee's own message.
 */
const deleteOwnMessage = async (
    messageId,
    senderId,
    options = {}
) => {
    return task_message.destroy({
        where: {
            id: messageId,
            sender_id: senderId,
            sender_type: "EMPLOYEE",
        },
        ...options,
    });
};

/* =========================================================
   Counts
   ========================================================= */

/**
 * Count all messages of task.
 */
const countMessages = async (
    taskId,
    options = {}
) => {
    return task_message.count({
        where: {
            task_id: taskId,
        },
        ...options,
    });
};

/**
 * Count messages by type.
 */
const countMessagesByType = async (
    taskId,
    options = {}
) => {
    return task_message.findAll({
        attributes: [
            "message_type",
            [
                fn(
                    "COUNT",
                    col("id")
                ),
                "count",
            ],
        ],
        where: {
            task_id: taskId,
        },
        group: ["message_type"],
        ...options,
    });
};

/* =========================================================
   Search Helpers
   ========================================================= */

/**
 * Find message by task, sender and exact message text.
 */
const findByTaskSenderAndMessage = async (
    taskId,
    senderId,
    message,
    options = {}
) => {
    return task_message.findOne({
        where: {
            task_id: taskId,
            sender_id: senderId,
            message,
        },
        ...options,
    });
};

/**
 * Get message IDs for a task.
 */
const getTaskMessageIds = async (
    taskId,
    options = {}
) => {
    return task_message.findAll({
        where: {
            task_id: taskId,
        },
        attributes: ["id", "uuid"],
        order: [["createdAt", "ASC"]],
        ...options,
    });
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    createTaskMessage,

    findById,
    findByUuid,
    findByTaskAndUuid,

    getTaskMessage,
    getTaskMessages,
    getAllTaskMessages,

    getLatestMessage,
    getLatestMessages,

    updateMessage,
    updateOwnMessage,

    deleteMessage,
    deleteOwnMessage,

    countMessages,
    countMessagesByType,

    findByTaskSenderAndMessage,
    getTaskMessageIds,
};