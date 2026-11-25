"use strict";

const {
    adminTaskMessageRepository,
    adminTaskRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
} = require("../../database/models");
const logger = require("../../utils/winston.util");
/* ========================= Constants ========================= */

const MESSAGE_TYPES = [
    "TEXT",
    "TASK",
    "SYSTEM",
    "ATTACHMENT",
];

/* ========================= Sanitize User ========================= */

const sanitizeUser = (userData) => {
    if (!userData) {
        return userData;
    }

    const user =
        typeof userData.toJSON === "function"
            ? userData.toJSON()
            : {
                ...userData,
            };

    delete user.password;

    return user;
};

/* ========================= Sanitize Message ========================= */

const sanitizeMessage = (messageData) => {
    if (!messageData) {
        return messageData;
    }

    const message =
        typeof messageData.toJSON === "function"
            ? messageData.toJSON()
            : {
                ...messageData,
            };

    /* ========================= Sanitize Sender ========================= */

    if (message.sender) {
        message.sender =
            sanitizeUser(message.sender);
    }

    return message;
};

/* ========================= Sanitize Messages ========================= */

const sanitizeMessages = (messages = []) => {
    return messages.map(
        (message) =>
            sanitizeMessage(message)
    );
};

/* ========================= Validate Task ========================= */

const validateTask = async (
    taskUuid,
    transaction = null
) => {
    const task =
        await adminTaskRepository.findByUuid(
            taskUuid,
            {
                transaction,
            }
        );

    if (!task) {
        throw new ApiError(
            404,
            "Task not found."
        );
    }

    return task;
};

/* ========================= Validate Sender ========================= */

const validateSender = async (
    senderId,
    transaction = null
) => {
    if (!senderId) {
        throw new ApiError(
            401,
            "Authenticated user not found."
        );
    }

    const sender =
        await adminTaskRepository.findUserById(
            senderId,
            {
                transaction,
            }
        );

    if (!sender) {
        throw new ApiError(
            404,
            "Sender not found."
        );
    }

    if (
        sender.status &&
        sender.status !== "ACTIVE"
    ) {
        throw new ApiError(
            403,
            "Inactive user cannot send task messages."
        );
    }

    return sender;
};

/* ========================= Validate Message Type ========================= */

const validateMessageType = (
    messageType
) => {
    const type =
        messageType || "TEXT";

    if (
        !MESSAGE_TYPES.includes(type)
    ) {
        throw new ApiError(
            400,
            `Invalid message type. Allowed types: ${MESSAGE_TYPES.join(", ")}.`
        );
    }

    return type;
};

/* ========================= Create Task Message ========================= */

const createTaskMessage = async (
    taskUuid,
    payload,
    senderId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Validate Task ========================= */

        const task =
            await validateTask(
                taskUuid,
                transaction
            );

        /* ========================= Validate Sender ========================= */

        await validateSender(
            senderId,
            transaction
        );

        /* ========================= Message ========================= */

        /* ========================= Message ========================= */

const message =
    typeof payload.message === "string"
        ? payload.message.trim()
        : "";

/* ========================= Message Type ========================= */

const messageType =
    validateMessageType(
        payload.message_type
    );

/*
 * TEXT / TASK / SYSTEM messages must
 * contain actual text.
 *
 * ATTACHMENT messages are allowed to
 * have an empty message because the
 * actual content is stored in
 * task_attachments.
 */
if (
    !message &&
    messageType !== "ATTACHMENT"
) {
    throw new ApiError(
        400,
        "Message is required."
    );
}

        /* ========================= Create ========================= */

        const messageData = {
            task_id: task.id,
            sender_id: senderId,
            sender_type:
                payload.sender_type ||
                "ADMIN",
            message,
            message_type: messageType,
        };

        const createdMessage =
            await adminTaskMessageRepository.createTaskMessage(
                messageData,
                transaction
            );

        await transaction.commit();

        /* ========================= Get Details ========================= */

        const result =
            await adminTaskMessageRepository.getTaskMessage(
                createdMessage.uuid
            );

        return sanitizeMessage(
            result
        );
    } catch (error) {
        await transaction.rollback();

        logger.error(
            "Create task message failed:",
            error
        );

        throw error;
    }
};

/* ========================= Get Task Message ========================= */

const getTaskMessage = async (
    messageUuid
) => {
    const message =
        await adminTaskMessageRepository.getTaskMessage(
            messageUuid
        );

    if (!message) {
        throw new ApiError(
            404,
            "Task message not found."
        );
    }

    return sanitizeMessage(
        message
    );
};

/* ========================= Get Task Messages ========================= */

const getTaskMessages = async (
    taskUuid,
    query = {}
) => {
    /* ========================= Validate Task ========================= */

    const task =
        await validateTask(
            taskUuid
        );

    const page = Math.max(
        Number(query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(
            Number(query.limit) || 50,
            1
        ),
        100
    );

    const search =
        typeof query.search === "string"
            ? query.search.trim()
            : "";

    const result =
        await adminTaskMessageRepository.getTaskMessages(
            {
                task_id: task.id,
                page,
                limit,
                search,
            }
        );

    return {
        ...result,
        rows:
            sanitizeMessages(
                result.rows
            ),
    };
};

/* ========================= Get All Task Messages ========================= */

const getAllTaskMessages = async (
    taskUuid
) => {
    const task =
        await validateTask(
            taskUuid
        );

    const messages =
        await adminTaskMessageRepository.getAllTaskMessages(
            task.id
        );

    return sanitizeMessages(
        messages
    );
};

/* ========================= Update Task Message ========================= */

const updateTaskMessage = async (
    messageUuid,
    payload,
    senderId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Validate Sender ========================= */

        await validateSender(
            senderId,
            transaction
        );

        /* ========================= Find Message ========================= */

        const message =
            await adminTaskMessageRepository.findByUuid(
                messageUuid,
                {
                    transaction,
                }
            );

        if (!message) {
            throw new ApiError(
                404,
                "Task message not found."
            );
        }

        /* ========================= Ownership ========================= */

        if (
            Number(message.sender_id) !==
            Number(senderId)
        ) {
            throw new ApiError(
                403,
                "You can only edit your own message."
            );
        }

        /* ========================= Message ========================= */

        const newMessage =
            typeof payload.message === "string"
                ? payload.message.trim()
                : "";

        if (!newMessage) {
            throw new ApiError(
                400,
                "Message is required."
            );
        }

        /* ========================= Update ========================= */

        await adminTaskMessageRepository.updateTaskMessage(
            message,
            {
                message: newMessage,
            },
            transaction
        );

        await transaction.commit();

        /* ========================= Get Updated Message ========================= */

        const updatedMessage =
            await adminTaskMessageRepository.getTaskMessage(
                messageUuid
            );

        return sanitizeMessage(
            updatedMessage
        );
    } catch (error) {
        await transaction.rollback();

        logger.error(
            "Update task message failed:",
            error
        );

        throw error;
    }
};

/* ========================= Delete Task Message ========================= */

const deleteTaskMessage = async (
    messageUuid,
    senderId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Validate Sender ========================= */

        await validateSender(
            senderId,
            transaction
        );

        /* ========================= Find Message ========================= */

        const message =
            await adminTaskMessageRepository.findByUuid(
                messageUuid,
                {
                    transaction,
                }
            );

        if (!message) {
            throw new ApiError(
                404,
                "Task message not found."
            );
        }

        /* ========================= Ownership ========================= */

        if (
            Number(message.sender_id) !==
            Number(senderId)
        ) {
            throw new ApiError(
                403,
                "You can only delete your own message."
            );
        }

        /* ========================= Delete ========================= */

        await adminTaskMessageRepository.deleteTaskMessage(
            message,
            transaction
        );

        await transaction.commit();

        return {
            uuid: messageUuid,
            deleted: true,
        };
    } catch (error) {
        await transaction.rollback();

        logger.error(
            "Delete task message failed:",
            error
        );

        throw error;
    }
};

/* ========================= Get Latest Task Message ========================= */

const getLatestTaskMessage = async (
    taskUuid
) => {
    const task =
        await validateTask(
            taskUuid
        );

    const message =
        await adminTaskMessageRepository.getLatestTaskMessage(
            task.id
        );

    return sanitizeMessage(
        message
    );
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestTaskMessages = async (
    taskUuid,
    limit = 20
) => {
    const task =
        await validateTask(
            taskUuid
        );

    const safeLimit = Math.min(
        Math.max(
            Number(limit) || 20,
            1
        ),
        100
    );

    const messages =
        await adminTaskMessageRepository.getLatestTaskMessages(
            task.id,
            safeLimit
        );

    /*
     * Repository returns newest first.
     * Chat UI generally needs oldest -> newest.
     */

    messages.reverse();

    return sanitizeMessages(
        messages
    );
};

/* ========================= Count Task Messages ========================= */

const countTaskMessages = async (
    taskUuid
) => {
    const task =
        await validateTask(
            taskUuid
        );

    return await adminTaskMessageRepository.countTaskMessages(
        task.id
    );
};

/* ========================= Count Task Messages By Type ========================= */

const countTaskMessagesByType = async (
    taskUuid,
    messageType
) => {
    const task =
        await validateTask(
            taskUuid
        );

    const type =
        validateMessageType(
            messageType
        );

    return await adminTaskMessageRepository.countTaskMessagesByType(
        task.id,
        type
    );
};

/* ========================= Export ========================= */

module.exports = {
    createTaskMessage,

    getTaskMessage,
    getTaskMessages,
    getAllTaskMessages,

    updateTaskMessage,
    deleteTaskMessage,

    getLatestTaskMessage,
    getLatestTaskMessages,

    countTaskMessages,
    countTaskMessagesByType,
};