"use strict";

const {
    employeeTaskRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
} = require("../../database/models");

const logger = require("../../utils/winston.util");

/* =========================================================
   Constants
   ========================================================= */

const EMPLOYEE_ALLOWED_STATUS = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
];

const EMPLOYEE_ALLOWED_PROGRESS_MIN = 0;
const EMPLOYEE_ALLOWED_PROGRESS_MAX = 100;

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Convert value into a positive integer.
 */
const toPositiveInteger = (value, fallback = null) => {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
        return fallback;
    }

    return number;
};

/**
 * Convert value into a valid pagination number.
 */
const normalizePagination = (page, limit) => {
    const normalizedPage = Math.max(
        1,
        toPositiveInteger(page, 1)
    );

    const normalizedLimit = Math.min(
        100,
        Math.max(
            1,
            toPositiveInteger(limit, 10)
        )
    );

    return {
        page: normalizedPage,
        limit: normalizedLimit,
    };
};

/**
 * Sanitize user object.
 */
const sanitizeUser = (user) => {
    if (!user) {
        return user;
    }

    const plainUser =
        typeof user.toJSON === "function"
            ? user.toJSON()
            : { ...user };

    delete plainUser.password;
    delete plainUser.reset_password_token;
    delete plainUser.reset_password_expires;

    return plainUser;
};

/**
 * Sanitize employee object.
 */
const sanitizeEmployee = (employee) => {
    if (!employee) {
        return employee;
    }

    const plainEmployee =
        typeof employee.toJSON === "function"
            ? employee.toJSON()
            : { ...employee };

    delete plainEmployee.password;
    delete plainEmployee.reset_password_token;
    delete plainEmployee.reset_password_expires;

    return plainEmployee;
};

/**
 * Sanitize task object and nested associations.
 */
const sanitizeTask = (taskData) => {
    if (!taskData) {
        return taskData;
    }

    const task =
        typeof taskData.toJSON === "function"
            ? taskData.toJSON()
            : { ...taskData };

    if (task.createdBy) {
        task.createdBy = sanitizeUser(task.createdBy);
    }

    if (task.updatedBy) {
        task.updatedBy = sanitizeUser(task.updatedBy);
    }

    if (Array.isArray(task.assignments)) {
        task.assignments = task.assignments.map((assignment) => {
            const sanitizedAssignment = {
                ...assignment,
            };

            if (sanitizedAssignment.employee) {
                sanitizedAssignment.employee = sanitizeEmployee(
                    sanitizedAssignment.employee
                );
            }

            if (sanitizedAssignment.assignedBy) {
                sanitizedAssignment.assignedBy = sanitizeUser(
                    sanitizedAssignment.assignedBy
                );
            }

            return sanitizedAssignment;
        });
    }

    if (Array.isArray(task.messages)) {
        task.messages = task.messages.map((message) => {
            const sanitizedMessage = {
                ...message,
            };

            if (sanitizedMessage.sender) {
                sanitizedMessage.sender = sanitizeUser(
                    sanitizedMessage.sender
                );
            }

            if (Array.isArray(sanitizedMessage.attachments)) {
                sanitizedMessage.attachments =
                    sanitizedMessage.attachments.map((attachment) => {
                        const sanitizedAttachment = {
                            ...attachment,
                        };

                        if (sanitizedAttachment.uploadedBy) {
                            sanitizedAttachment.uploadedBy =
                                sanitizeUser(
                                    sanitizedAttachment.uploadedBy
                                );
                        }

                        return sanitizedAttachment;
                    });
            }

            return sanitizedMessage;
        });
    }

    if (Array.isArray(task.attachments)) {
        task.attachments = task.attachments.map((attachment) => {
            const sanitizedAttachment = {
                ...attachment,
            };

            if (sanitizedAttachment.uploadedBy) {
                sanitizedAttachment.uploadedBy = sanitizeUser(
                    sanitizedAttachment.uploadedBy
                );
            }

            return sanitizedAttachment;
        });
    }

    return task;
};

/**
 * Sanitize task rows.
 */
const sanitizeTasks = (tasks = []) => {
    return tasks.map(sanitizeTask);
};

/**
 * Validate employee ID.
 */
const validateEmployeeId = (employeeId) => {
    const normalizedEmployeeId = toPositiveInteger(
        employeeId
    );

    if (!normalizedEmployeeId) {
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
 * Validate employee task access.
 */
const getAssignedEmployeeTask = async (
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
 * Validate employee status.
 */
const validateEmployeeStatus = (status) => {
    if (!EMPLOYEE_ALLOWED_STATUS.includes(status)) {
        throw new ApiError(
            403,
            "You are not allowed to set this task status."
        );
    }

    return status;
};

/**
 * Validate progress.
 */
const validateProgress = (progress) => {
    const normalizedProgress = Number(progress);

    if (
        !Number.isInteger(normalizedProgress) ||
        normalizedProgress < EMPLOYEE_ALLOWED_PROGRESS_MIN ||
        normalizedProgress > EMPLOYEE_ALLOWED_PROGRESS_MAX
    ) {
        throw new ApiError(
            400,
            "Progress must be an integer between 0 and 100."
        );
    }

    return normalizedProgress;
};

/* =========================================================
   Get Employee Tasks
   ========================================================= */

/**
 * Get tasks assigned to logged-in employee.
 */
const getTasks = async ({
    employeeId,
    page = 1,
    limit = 10,
    search,
    status,
    priority,
    clientId,
    startDate,
    dueDate,
} = {}) => {
    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const pagination = normalizePagination(
        page,
        limit
    );

    const result = await employeeTaskRepository.getEmployeeTasks({
        employeeId: normalizedEmployeeId,
        page: pagination.page,
        limit: pagination.limit,
        search: search?.trim() || undefined,
        status,
        priority,
        clientId: toPositiveInteger(clientId),
        startDate,
        dueDate,
    });

    return {
        rows: sanitizeTasks(result.rows),
        count: result.count,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
    };
};

/* =========================================================
   Get Employee Task Details
   ========================================================= */

/**
 * Get details of a task assigned to employee.
 */
const getTask = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedEmployeeTask(
        normalizedTaskUuid,
        normalizedEmployeeId
    );

    return sanitizeTask(task);
};

/* =========================================================
   Update Task Status
   ========================================================= */

/**
 * Employee can update only allowed task statuses.
 *
 * Employee cannot update:
 * - title
 * - description
 * - client
 * - assignments
 * - priority
 * - dates
 * - created_by
 * - updated_by
 */
const updateTaskStatus = async (
    taskUuid,
    employeeId,
    status
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const normalizedStatus = validateEmployeeStatus(
        status
    );

    const transaction = await sequelize.transaction();

    try {
        const task = await employeeTaskRepository.getEmployeeTaskDetails(
            normalizedTaskUuid,
            normalizedEmployeeId,
            {
                transaction,
                lock: transaction.LOCK.UPDATE,
            }
        );

        if (!task) {
            throw new ApiError(
                404,
                "Task not found or you are not assigned to this task."
            );
        }

        const taskId = task.id;

        const updateData = {
            status: normalizedStatus,
        };

        /*
         * If employee moves task to IN_REVIEW,
         * progress should be at least 100.
         *
         * We do not automatically mark COMPLETED because
         * employee is not allowed to complete the task here.
         */
        if (
            normalizedStatus === "IN_REVIEW" &&
            Number(task.progress || 0) < 100
        ) {
            updateData.progress = 100;
        }

        /*
         * Employee status update should not set completed_at.
         * COMPLETED is not allowed in employee status list.
         */
        updateData.completed_at = null;

        await employeeTaskRepository.updateTaskStatus(
            taskId,
            normalizedStatus,
            updateData,
            {
                transaction,
            }
        );

        await transaction.commit();

        const updatedTask = await employeeTaskRepository.getEmployeeTaskDetails(
            normalizedTaskUuid,
            normalizedEmployeeId
        );

        return sanitizeTask(updatedTask);
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error("Employee task status update failed", {
            taskUuid: normalizedTaskUuid,
            employeeId: normalizedEmployeeId,
            status: normalizedStatus,
            error: error.message,
        });

        throw error;
    }
};

/* =========================================================
   Update Task Progress
   ========================================================= */

/**
 * Employee can update progress of assigned task.
 */
const updateTaskProgress = async (
    taskUuid,
    employeeId,
    progress
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const normalizedProgress = validateProgress(
        progress
    );

    const transaction = await sequelize.transaction();

    try {
        const task = await employeeTaskRepository.getEmployeeTaskDetails(
            normalizedTaskUuid,
            normalizedEmployeeId,
            {
                transaction,
                lock: transaction.LOCK.UPDATE,
            }
        );

        if (!task) {
            throw new ApiError(
                404,
                "Task not found or you are not assigned to this task."
            );
        }

        const updateData = {
            progress: normalizedProgress,
        };

        /*
         * Employee progress 100 means work is ready for review.
         * We do not automatically set COMPLETED.
         */
        if (
            normalizedProgress === 100 &&
            task.status !== "COMPLETED"
        ) {
            updateData.status = "IN_REVIEW";
        }

        await employeeTaskRepository.updateTask(
            task.id,
            updateData,
            {
                transaction,
            }
        );

        await transaction.commit();

        const updatedTask = await employeeTaskRepository.getEmployeeTaskDetails(
            normalizedTaskUuid,
            normalizedEmployeeId
        );

        return sanitizeTask(updatedTask);
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error("Employee task progress update failed", {
            taskUuid: normalizedTaskUuid,
            employeeId: normalizedEmployeeId,
            progress: normalizedProgress,
            error: error.message,
        });

        throw error;
    }
};

/* =========================================================
   Task Summary
   ========================================================= */

/**
 * Get latest message of assigned task.
 */
const getLatestTaskMessage = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedEmployeeTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    return employeeTaskRepository.getLatestTaskMessage(
        task.id
    );
};

/**
 * Count messages of assigned task.
 */
const countTaskMessages = async (
    taskUuid,
    employeeId
) => {
    const normalizedTaskUuid = validateTaskUuid(
        taskUuid
    );

    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const task = await getAssignedEmployeeTask(
        normalizedTaskUuid,
        normalizedEmployeeId,
        {
            attributes: ["id", "uuid"],
        }
    );

    return employeeTaskRepository.countTaskMessages(
        task.id
    );
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    EMPLOYEE_ALLOWED_STATUS,

    getTasks,
    getTask,

    updateTaskStatus,
    updateTaskProgress,

    getLatestTaskMessage,
    countTaskMessages,

    sanitizeTask,
    sanitizeTasks,

    validateEmployeeId,
    validateTaskUuid,
    getAssignedEmployeeTask,
};