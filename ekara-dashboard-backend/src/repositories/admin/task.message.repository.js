"use strict";

const { Op } = require("sequelize");

const {
    task_message,
    task,
    user,
    task_attachment,
} = require("../../database/models");

/* ========================= Create Message ========================= */

const createTaskMessage = async (
    payload,
    transaction = null
) => {
    return await task_message.create(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= Find Message By ID ========================= */

const findById = async (
    id,
    options = {}
) => {
    return await task_message.findByPk(
        id,
        {
            ...options,
        }
    );
};

/* ========================= Find Message By UUID ========================= */

const findByUuid = async (
    uuid,
    options = {}
) => {
    return await task_message.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/* ========================= Get Task Message ========================= */

const getTaskMessage = async (
    uuid
) => {
    return await task_message.findOne({
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
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
                order: [
                    ["createdAt", "ASC"],
                ],
            },
        ],
    });
};

/* ========================= Get Task Messages ========================= */

const getTaskMessages = async ({
    task_id,
    page = 1,
    limit = 50,
    search = "",
}) => {
    const offset =
        (Number(page) - 1) * Number(limit);

    const where = {
        task_id,
    };

    /* ========================= Search ========================= */

    if (search && search.trim()) {
        where.message = {
            [Op.like]: `%${search.trim()}%`,
        };
    }

    const {
        rows,
        count,
    } = await task_message.findAndCountAll({
        where,

        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "file_url",
                    "file_name",
                    "file_type",
                    "file_size",
                    "resource_type",
                    "uploaded_by",
                    "createdAt",
                ],
            },
        ],

        order: [
            ["createdAt", "ASC"],
            ["id", "ASC"],
        ],

        limit: Number(limit),
        offset,

        distinct: true,
    });

    return {
        rows,
        count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(
            count / Number(limit)
        ),
    };
};

/* ========================= Get All Task Messages ========================= */

const getAllTaskMessages = async (
    task_id,
    options = {}
) => {
    return await task_message.findAll({
        where: {
            task_id,
        },

        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "file_url",
                    "file_name",
                    "file_type",
                    "file_size",
                    "resource_type",
                    "uploaded_by",
                    "createdAt",
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

/* ========================= Update Message ========================= */

const updateTaskMessage = async (
    messageData,
    payload,
    transaction = null
) => {
    return await messageData.update(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= Delete Message ========================= */

const deleteTaskMessage = async (
    messageData,
    transaction = null
) => {
    return await messageData.destroy({
        transaction,
    });
};

/* ========================= Count Task Messages ========================= */

const countTaskMessages = async (
    task_id
) => {
    return await task_message.count({
        where: {
            task_id,
        },
    });
};

/* ========================= Count Task Messages By Type ========================= */

const countTaskMessagesByType = async (
    task_id,
    message_type
) => {
    return await task_message.count({
        where: {
            task_id,
            message_type,
        },
    });
};

/* ========================= Get Latest Task Message ========================= */

const getLatestTaskMessage = async (
    task_id
) => {
    return await task_message.findOne({
        where: {
            task_id,
        },

        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
            },
        ],

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestTaskMessages = async (
    task_id,
    limit = 20
) => {
    return await task_message.findAll({
        where: {
            task_id,
        },

        include: [
            {
                model: user,
                as: "sender",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                ],
            },
            {
                model: task_attachment,
                as: "attachments",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "file_url",
                    "file_name",
                    "file_type",
                    "file_size",
                    "resource_type",
                    "uploaded_by",
                    "createdAt",
                ],
            },
        ],

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],

        limit: Number(limit),
    });
};

/* ========================= Check Task Message Ownership ========================= */

const findMessageByTaskAndSender = async (
    task_id,
    sender_id,
    message_id,
    options = {}
) => {
    return await task_message.findOne({
        where: {
            id: message_id,
            task_id,
            sender_id,
        },
        ...options,
    });
};

/* ========================= Get Task Message IDs ========================= */

const getTaskMessageIds = async (
    task_id
) => {
    return await task_message.findAll({
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
    createTaskMessage,

    findById,
    findByUuid,

    getTaskMessage,
    getTaskMessages,
    getAllTaskMessages,

    updateTaskMessage,
    deleteTaskMessage,

    countTaskMessages,
    countTaskMessagesByType,

    getLatestTaskMessage,
    getLatestTaskMessages,

    findMessageByTaskAndSender,
    getTaskMessageIds,
};