"use strict";

const {
    employeeTaskRepository,
    employeeTaskMessageRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
    user,
} = require("../../database/models");

const logger = require("../../utils/winston.util");

/* =========================================================
   Constants
   ========================================================= */

const MESSAGE_TYPES = [
    "TEXT",
    "TASK",
    "SYSTEM",
    "ATTACHMENT",
];

const EMPLOYEE_SENDER_TYPE = "EMPLOYEE";

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Sanitize user object.
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

    return attachment;
};

/**
 * Sanitize message.
 */
const sanitizeMessage = (messageData) => {
    if (!messageData) {
        return messageData;
    }

    const message =
        typeof messageData.toJSON === "function"
            ? messageData.toJSON()
            : { ...messageData };

    if (message.sender) {
        message.sender = sanitizeUser(
            message.sender
        );
    }

    if (Array.isArray(message.attachments)) {
        message.attachments = message.attachments.map(
            sanitizeAttachment
        );
    }

    return message;
};

/**
 * Sanitize messages.
 */
const sanitizeMessages = (messages = []) => {
    return messages.map(sanitizeMessage);
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
 * Validate message UUID.
 */
const validateMessageUuid = (messageUuid) => {
    if (
        !messageUuid ||
        typeof messageUuid !== "string" ||
        !messageUuid.trim()
    ) {
        throw new ApiError(
            400,
            "Message UUID is required."
        );
    }

    return messageUuid.trim();
};

/**
 * Validate task access.
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
 * Validate message type.
 */
const validateMessageType = (messageType) => {
    const normalizedType = messageType || "TEXT";

    if (!MESSAGE_TYPES.includes(normalizedType)) {
        throw new ApiError(
            400,
            "Invalid message type."
        );
    }

    return normalizedType;
};

/**
 * Validate message text.
 */
const validateMessageText = (
    message,
    messageType
) => {
    const normalizedMessage =
        typeof message === "string"
            ? message.trim()
            : "";

    /*
     * Attachment-only messages may have an empty message.
     */
    if (
        !normalizedMessage &&
        messageType !== "ATTACHMENT"
    ) {
        throw new ApiError(
            400,
            "Message is required."
        );
    }

    if (normalizedMessage.length > 10000) {
        throw new ApiError(
            400,
            "Message cannot exceed 10000 characters."
        );
    }

    return normalizedMessage;
};

/**
 * Validate authenticated sender.
 */
const validateSender = async (
    employeeId,
    options = {}
) => {
    const sender = await user.findOne({
        where: {
            id: employeeId,
            status: "ACTIVE",
        },
        ...options,
    });

    if (!sender) {
        throw new ApiError(
            401,
            "Authenticated employee account is not active."
        );
    }

    return sender;
};

/* =========================================================
   Create Message
   ========================================================= */

/**
 * Create a message in an assigned task.
 */
const createMessage = async (
    taskUuid,
    employeeId,
    payload = {}
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const messageType = validateMessageType(
        payload.message_type
    );

    const message = validateMessageText(
        payload.message,
        messageType
    );

    const transaction = await sequelize.transaction();

    try {
        const task = await getAssignedTask(
            normalizedTaskUuid,
            normalizedEmployeeId,
            {
                transaction,
                attributes: ["id", "uuid"],
            }
        );

        await validateSender(
            normalizedEmployeeId,
            {
                transaction,
            }
        );

        const createdMessage =
            await employeeTaskMessageRepository.createTaskMessage(
                {
                    task_id: task.id,
                    sender_id: normalizedEmployeeId,
                    sender_type: EMPLOYEE_SENDER_TYPE,
                    message,
                    message_type: messageType,
                },
                {
                    transaction,
                }
            );

        await transaction.commit();

        const savedMessage =
            await employeeTaskMessageRepository.getTaskMessage(
                task.id,
                createdMessage.uuid
            );

        return sanitizeMessage(savedMessage);
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error("Employee task message creation failed", {
            taskUuid: normalizedTaskUuid,
            employeeId: normalizedEmployeeId,
            error: error.message,
        });

        throw error;
    }
};

/* =========================================================
   Get Messages
   ========================================================= */

/**
 * Get messages of assigned task.
 */
const getMessages = async ({
    taskUuid,
    employeeId,
    page = 1,
    limit = 50,
    search,
    messageType,
} = {}) => {
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

    const result =
        await employeeTaskMessageRepository.getTaskMessages({
            taskId: task.id,
            page,
            limit,
            search: search?.trim() || undefined,
            messageType,
        });

    return {
        rows: sanitizeMessages(result.rows),
        count: result.count,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
    };
};

/**
 * Get all messages of assigned task.
 */
const getAllMessages = async (
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

    const messages =
        await employeeTaskMessageRepository.getAllTaskMessages(
            task.id
        );

    return sanitizeMessages(messages);
};

/* =========================================================
   Get Single Message
   ========================================================= */

/**
 * Get one message from assigned task.
 */
const getMessage = async (
    taskUuid,
    messageUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedMessageUuid = validateMessageUuid(
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
        await employeeTaskMessageRepository.getTaskMessage(
            task.id,
            normalizedMessageUuid
        );

    if (!message) {
        throw new ApiError(
            404,
            "Message not found."
        );
    }

    return sanitizeMessage(message);
};

/* =========================================================
   Latest Messages
   ========================================================= */

/**
 * Get latest single message.
 */
const getLatestMessage = async (
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

    const message =
        await employeeTaskMessageRepository.getLatestMessage(
            task.id
        );

    return sanitizeMessage(message);
};

/**
 * Get latest messages list.
 */
const getLatestMessages = async (
    taskUuid,
    employeeId,
    limit = 10
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

    const messages =
        await employeeTaskMessageRepository.getLatestMessages(
            task.id,
            limit
        );

    return sanitizeMessages(messages);
};

/* =========================================================
   Update Own Message
   ========================================================= */

/**
 * Employee can update only their own message.
 */
const updateMessage = async (
    taskUuid,
    messageUuid,
    employeeId,
    payload = {}
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedMessageUuid = validateMessageUuid(
        messageUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const updatedMessage =
        typeof payload.message === "string"
            ? payload.message.trim()
            : "";

    if (!updatedMessage) {
        throw new ApiError(
            400,
            "Message is required."
        );
    }

    if (updatedMessage.length > 10000) {
        throw new ApiError(
            400,
            "Message cannot exceed 10000 characters."
        );
    }

    const task = await getAssignedTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    const existingMessage =
        await employeeTaskMessageRepository.findByTaskAndUuid(
            task.id,
            normalizedMessageUuid
        );

    if (!existingMessage) {
        throw new ApiError(
            404,
            "Message not found."
        );
    }

    if (
        existingMessage.sender_id !== normalizedEmployeeId ||
        existingMessage.sender_type !== EMPLOYEE_SENDER_TYPE
    ) {
        throw new ApiError(
            403,
            "You can update only your own messages."
        );
    }

    if (existingMessage.message_type === "SYSTEM") {
        throw new ApiError(
            403,
            "System messages cannot be updated."
        );
    }

    await employeeTaskMessageRepository.updateOwnMessage(
        existingMessage.id,
        normalizedEmployeeId,
        {
            message: updatedMessage,
        }
    );

    const message =
        await employeeTaskMessageRepository.getTaskMessage(
            task.id,
            normalizedMessageUuid
        );

    return sanitizeMessage(message);
};

/* =========================================================
   Delete Own Message
   ========================================================= */

/**
 * Employee can delete only their own message.
 */
const deleteMessage = async (
    taskUuid,
    messageUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedMessageUuid = validateMessageUuid(
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

    const existingMessage =
        await employeeTaskMessageRepository.findByTaskAndUuid(
            task.id,
            normalizedMessageUuid
        );

    if (!existingMessage) {
        throw new ApiError(
            404,
            "Message not found."
        );
    }

    if (
        existingMessage.sender_id !== normalizedEmployeeId ||
        existingMessage.sender_type !== EMPLOYEE_SENDER_TYPE
    ) {
        throw new ApiError(
            403,
            "You can delete only your own messages."
        );
    }

    if (existingMessage.message_type === "SYSTEM") {
        throw new ApiError(
            403,
            "System messages cannot be deleted."
        );
    }

    await employeeTaskMessageRepository.deleteOwnMessage(
        existingMessage.id,
        normalizedEmployeeId
    );

    return {
        message: "Message deleted successfully.",
        uuid: normalizedMessageUuid,
    };
};

/* =========================================================
   Counts
   ========================================================= */

/**
 * Count messages.
 */
const countMessages = async (
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

    return employeeTaskMessageRepository.countMessages(
        task.id
    );
};

/**
 * Count messages by type.
 */
const countMessagesByType = async (
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

    return employeeTaskMessageRepository.countMessagesByType(
        task.id
    );
};

/**
 * Get message IDs.
 */
const getMessageIds = async (
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

    return employeeTaskMessageRepository.getTaskMessageIds(
        task.id
    );
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    MESSAGE_TYPES,
    EMPLOYEE_SENDER_TYPE,

    createMessage,

    getMessages,
    getAllMessages,
    getMessage,

    getLatestMessage,
    getLatestMessages,

    updateMessage,
    deleteMessage,

    countMessages,
    countMessagesByType,
    getMessageIds,

    sanitizeMessage,
    sanitizeMessages,

    validateEmployeeId,
    validateTaskUuid,
    validateMessageUuid,
};