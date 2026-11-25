"use strict";

const {
    adminTaskRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
} = require("../../database/models");

const logger = require("../../utils/winston.util");

/* ========================= Helpers ========================= */

// Remove sensitive / unnecessary fields from task response
const sanitizeTask = (taskData) => {
    if (!taskData) {
        return null;
    }

    const data =
        typeof taskData.toJSON === "function"
            ? taskData.toJSON()
            : { ...taskData };

    // Remove nested user password if accidentally included
    if (data.createdBy) {
        delete data.createdBy.password;
    }

    if (data.updatedBy) {
        delete data.updatedBy.password;
    }

    if (data.assignments) {
        data.assignments =
            data.assignments.map(
                (assignment) => {
                    const assignmentData =
                        typeof assignment.toJSON === "function"
                            ? assignment.toJSON()
                            : { ...assignment };

                    if (
                        assignmentData.assignedBy
                    ) {
                        delete assignmentData
                            .assignedBy.password;
                    }

                    if (
                        assignmentData.employee
                    ) {
                        delete assignmentData
                            .employee.password;
                    }

                    return assignmentData;
                }
            );
    }

    if (data.messages) {
        data.messages =
            data.messages.map(
                (message) => {
                    const messageData =
                        typeof message.toJSON === "function"
                            ? message.toJSON()
                            : { ...message };

                    if (messageData.sender) {
                        delete messageData.sender.password;
                    }

                    return messageData;
                }
            );
    }

    if (data.attachments) {
        data.attachments =
            data.attachments.map(
                (attachment) => {
                    const attachmentData =
                        typeof attachment.toJSON === "function"
                            ? attachment.toJSON()
                            : { ...attachment };

                    if (
                        attachmentData.uploadedBy
                    ) {
                        delete attachmentData
                            .uploadedBy.password;
                    }

                    return attachmentData;
                }
            );
    }

    return data;
};

/* ========================= Task Code ========================= */

// Generate human readable task code
// Example: TASK-000001
const generateTaskCode = async (
    transaction
) => {
    let taskCode;

    let lastTask = null;

    try {
        const result =
            await adminTaskRepository.getTasks(
                {
                    page: 1,
                    limit: 1,
                    search: "",
                }
            );

        if (
            result &&
            result.rows &&
            result.rows.length > 0
        ) {
            lastTask =
                result.rows[0];
        }
    } catch (error) {
        logger.error(
            `Failed to get last task code: ${error.message}`
        );
    }

    if (
        lastTask &&
        lastTask.task_code
    ) {
        const match =
            lastTask.task_code.match(
                /^TASK-(\d+)$/
            );

        if (match) {
            const nextNumber =
                parseInt(
                    match[1],
                    10
                ) + 1;

            taskCode =
                `TASK-${String(
                    nextNumber
                ).padStart(6, "0")}`;
        }
    }

    if (!taskCode) {
        taskCode =
            "TASK-000001";
    }

    /*
     * Safety check in case generated
     * task code already exists.
     */
    let existingTask =
        await adminTaskRepository.findByTaskCode(
            taskCode,
            {
                paranoid: false,
                transaction,
            }
        );

    while (existingTask) {
        const match =
            taskCode.match(
                /^TASK-(\d+)$/
            );

        const nextNumber =
            match
                ? parseInt(
                      match[1],
                      10
                  ) + 1
                : 1;

        taskCode =
            `TASK-${String(
                nextNumber
            ).padStart(6, "0")}`;

        existingTask =
            await adminTaskRepository.findByTaskCode(
                taskCode,
                {
                    paranoid: false,
                    transaction,
                }
            );
    }

    return taskCode;
};

/* ========================= Validate Client ========================= */

const validateClient = async (
    clientId,
    transaction
) => {
    if (!clientId) {
        throw new ApiError(
            400,
            "Client is required."
        );
    }

    const client =
        await adminTaskRepository.findClientById(
            clientId,
            {
                transaction,
            }
        );

    if (!client) {
        throw new ApiError(
            404,
            "Client not found."
        );
    }

    return client;
};

/* ========================= Validate Employee ========================= */

const validateEmployees = async (
    employeeIds,
    transaction
) => {
    if (
        !Array.isArray(employeeIds) ||
        employeeIds.length === 0
    ) {
        throw new ApiError(
            400,
            "At least one employee must be assigned to the task."
        );
    }

    /*
     * Remove duplicate IDs as an additional
     * safety layer.
     *
     * Joi already validates uniqueness, but
     * keeping this here protects service-level
     * usage as well.
     */
    const uniqueEmployeeIds = [
        ...new Set(
            employeeIds.map(
                (id) => Number(id)
            )
        ),
    ];

    if (
        uniqueEmployeeIds.length !==
        employeeIds.length
    ) {
        throw new ApiError(
            400,
            "The same employee cannot be assigned more than once."
        );
    }

    const employees = [];

    for (
        const employeeId of uniqueEmployeeIds
    ) {
        const employee =
            await adminTaskRepository.findEmployeeById(
                employeeId,
                {
                    transaction,
                }
            );

        if (!employee) {
            throw new ApiError(
                404,
                `Employee with ID ${employeeId} not found.`
            );
        }

        if (
            employee.status !==
            "ACTIVE"
        ) {
            throw new ApiError(
                400,
                `Employee with ID ${employeeId} is inactive and cannot be assigned to a task.`
            );
        }

        employees.push(employee);
    }

    return employees;
};

/* ========================= Create Task ========================= */

const createTask = async (
    payload,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Client ========================= */

        await validateClient(
            payload.client_id,
            transaction
        );

        /* ========================= Employees ========================= */

        await validateEmployees(
            payload.employee_ids,
            transaction
        );

        /* ========================= Task Code ========================= */

        const taskCode =
            await generateTaskCode(
                transaction
            );

        /* ========================= Task Data ========================= */

        const taskData = {
            task_code:
                taskCode,

            title:
                payload.title,

            description:
                payload.description ||
                null,

            client_id:
                payload.client_id,

            priority:
                payload.priority ||
                "MEDIUM",

            status:
                payload.status ||
                "TODO",

            start_date:
                payload.start_date ||
                null,

            due_date:
                payload.due_date ||
                null,

            estimated_hours:
                payload.estimated_hours ||
                null,

            progress:
                payload.progress !==
                undefined
                    ? payload.progress
                    : 0,

            completed_at:
                null,

            created_by:
                userId,

            updated_by:
                userId,
        };

        /* ========================= Completed Task ========================= */

        if (
            taskData.status ===
            "COMPLETED"
        ) {
            taskData.progress =
                100;

            taskData.completed_at =
                new Date();
        }

        /* ========================= Create Task ========================= */

        const task =
            await adminTaskRepository.createTask(
                taskData,
                transaction
            );

        /* ========================= Assign Employees ========================= */

        for (
            const employeeId of
                payload.employee_ids
        ) {
            await adminTaskRepository.createTaskAssignment(
                {
                    task_id:
                        task.id,

                    employee_id:
                        employeeId,

                    assigned_by:
                        userId,
                },
                transaction
            );
        }

        /* ========================= Commit ========================= */

        await transaction.commit();

        /* ========================= Get Created Task ========================= */

        const createdTask =
            await adminTaskRepository.getTaskDetails(
                task.uuid
            );

        return sanitizeTask(
            createdTask
        );
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Get Task ========================= */

const getTask = async (
    uuid
) => {
    const task =
        await adminTaskRepository.getTaskDetails(
            uuid
        );

    if (!task) {
        throw new ApiError(
            404,
            "Task not found."
        );
    }

    return sanitizeTask(
        task
    );
};

/* ========================= Get Tasks ========================= */

const getTasks = async (
    query
) => {
    const result =
        await adminTaskRepository.getTasks(
            query
        );

    result.rows =
        result.rows.map(
            (task) =>
                sanitizeTask(
                    task
                )
        );

    return result;
};

/* ========================= Update Task ========================= */

const updateTask = async (
    uuid,
    payload,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Find Task ========================= */

        const task =
            await adminTaskRepository.findByUuid(
                uuid,
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

        /* ========================= Client ========================= */

        if (
            payload.client_id !==
            undefined
        ) {
            await validateClient(
                payload.client_id,
                transaction
            );
        }

        /* ========================= Employees ========================= */

        if (
            payload.employee_ids !==
            undefined
        ) {
            await validateEmployees(
                payload.employee_ids,
                transaction
            );
        }

        /* ========================= Task Data ========================= */

        /*
         * employee_ids belongs to
         * task_assignments table.
         *
         * It must never be passed to
         * tasks table.
         */
        const {
            employee_ids,
            ...taskPayloadWithoutEmployees
        } = payload;

        const taskPayload = {
            ...taskPayloadWithoutEmployees,
            updated_by: userId,
        };

        /* ========================= Status Handling ========================= */

        if (
            taskPayload.status ===
            "COMPLETED"
        ) {
            taskPayload.progress =
                100;

            taskPayload.completed_at =
                new Date();
        } else if (
            taskPayload.status &&
            taskPayload.status !==
                "COMPLETED"
        ) {
            taskPayload.completed_at =
                null;
        }

        /* ========================= Progress Handling ========================= */

        if (
            taskPayload.progress !==
                undefined &&
            Number(
                taskPayload.progress
            ) >= 100
        ) {
            taskPayload.progress =
                100;

            if (
                taskPayload.status ===
                undefined
            ) {
                taskPayload.status =
                    "COMPLETED";
            }

            taskPayload.completed_at =
                new Date();
        }

        /* ========================= Update Task ========================= */

        await adminTaskRepository.updateTask(
            task,
            taskPayload,
            transaction
        );

        /* ========================= Employee Assignment Sync ========================= */

        if (
            employee_ids !==
            undefined
        ) {
            const existingAssignments =
                await adminTaskRepository.getTaskAssignments(
                    task.id,
                    {
                        transaction,
                    }
                );

            const existingEmployeeIds =
                existingAssignments.map(
                    (assignment) =>
                        Number(
                            assignment.employee_id
                        )
                );

            const newEmployeeIds =
                employee_ids.map(
                    (employeeId) =>
                        Number(employeeId)
                );

            /* ========================= Remove Unselected Employees ========================= */

            for (
                const assignment of
                    existingAssignments
            ) {
                const employeeId =
                    Number(
                        assignment.employee_id
                    );

                if (
                    !newEmployeeIds.includes(
                        employeeId
                    )
                ) {
                    await adminTaskRepository.deleteTaskAssignment(
                        assignment,
                        transaction
                    );
                }
            }

            /* ========================= Add New Employees ========================= */

            for (
                const employeeId of
                    newEmployeeIds
            ) {
                if (
                    !existingEmployeeIds.includes(
                        employeeId
                    )
                ) {
                    await adminTaskRepository.createTaskAssignment(
                        {
                            task_id:
                                task.id,

                            employee_id:
                                employeeId,

                            assigned_by:
                                userId,
                        },
                        transaction
                    );
                }
            }
        }

        /* ========================= Commit ========================= */

        await transaction.commit();

        /* ========================= Get Updated Task ========================= */

        const updatedTask =
            await adminTaskRepository.getTaskDetails(
                uuid
            );

        return sanitizeTask(
            updatedTask
        );
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Update Task Priority ========================= */

const updateTaskPriority = async (
    uuid,
    priority,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const task =
            await adminTaskRepository.updateTaskPriority(
                uuid,
                priority,
                userId,
                transaction
            );

        if (!task) {
            throw new ApiError(
                404,
                "Task not found."
            );
        }

        await transaction.commit();

        return sanitizeTask(
            task
        );
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Update Task Status ========================= */

const updateTaskStatus = async (
    uuid,
    status,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const task =
            await adminTaskRepository.updateTaskStatus(
                uuid,
                status,
                userId,
                transaction
            );

        if (!task) {
            throw new ApiError(
                404,
                "Task not found."
            );
        }

        await transaction.commit();

        return sanitizeTask(
            task
        );
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Delete Task ========================= */

// Soft delete task
const deleteTask = async (
    uuid
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const task =
            await adminTaskRepository.findByUuid(
                uuid,
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

        await adminTaskRepository.deleteTask(
            task,
            transaction
        );

        await transaction.commit();

        return true;
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Restore Task ========================= */

const restoreTask = async (
    uuid,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const task =
            await adminTaskRepository.restoreTask(
                uuid,
                userId,
                transaction
            );

        if (!task) {
            throw new ApiError(
                404,
                "Deleted task not found."
            );
        }

        await transaction.commit();

        return sanitizeTask(
            task
        );
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Force Delete Task ========================= */

const forceDeleteTask = async (
    uuid
) => {
    /* ========================= Find Deleted Task ========================= */

    const task =
        await adminTaskRepository.findDeletedByUuid(
            uuid
        );

    if (!task) {
        throw new ApiError(
            404,
            "Task not found."
        );
    }

    /* ========================= Check Soft Delete ========================= */

    if (!task.deleted_at) {
        throw new ApiError(
            400,
            "Task must be soft deleted before force delete."
        );
    }

    /* ========================= Transaction ========================= */

    const transaction =
        await sequelize.transaction();

    try {
        await adminTaskRepository.forceDeleteTask(
            task,
            transaction
        );

        await transaction.commit();

        return true;
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Get Trash Tasks ========================= */

const getTrashTasks = async (
    query
) => {
    const result =
        await adminTaskRepository.getTrashTasks(
            query
        );

    result.rows =
        result.rows.map(
            (task) =>
                sanitizeTask(
                    task
                )
        );

    return result;
};

/* ========================= Validate Employee ========================= */

const validateEmployee = async (
    employeeId,
    transaction
) => {
    const employeeData =
        await adminTaskRepository.findEmployeeById(
            employeeId,
            {
                transaction,
            }
        );

    if (!employeeData) {
        throw new ApiError(
            404,
            "Employee not found."
        );
    }

    if (
        employeeData.status &&
        employeeData.status !== "ACTIVE"
    ) {
        throw new ApiError(
            400,
            "Only active employees can be assigned to a task."
        );
    }

    return employeeData;
};

/* ========================= Add Task Assignment ========================= */

const addTaskAssignment = async (
    uuid,
    employeeId,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const task =
            await adminTaskRepository.findByUuid(
                uuid,
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

        /* ========================= Employee Validation ========================= */

        await validateEmployee(
            employeeId,
            transaction
        );

        /* ========================= Duplicate Check ========================= */

        const existingAssignment =
            await adminTaskRepository.findTaskEmployeeAssignment(
                task.id,
                employeeId,
                {
                    transaction,
                }
            );

        if (existingAssignment) {
            throw new ApiError(
                409,
                "Employee is already assigned to this task."
            );
        }

        /* ========================= Create Assignment ========================= */

        const assignment =
            await adminTaskRepository.createTaskAssignment(
                {
                    task_id: task.id,
                    employee_id: employeeId,
                    assigned_by: userId,
                },
                transaction
            );

        await transaction.commit();

        return assignment;

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Remove Task Assignment ========================= */

const removeTaskAssignment = async (
    uuid,
    employeeId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Find Task ========================= */

        const task =
            await adminTaskRepository.findByUuid(
                uuid,
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

        /* ========================= Find Assignment ========================= */

        const assignment =
            await adminTaskRepository.findTaskEmployeeAssignment(
                task.id,
                employeeId,
                {
                    transaction,
                }
            );

        if (!assignment) {
            throw new ApiError(
                404,
                "Task assignment not found."
            );
        }

        /* ========================= Delete Assignment ========================= */

        await adminTaskRepository.deleteTaskAssignment(
            assignment,
            transaction
        );

        await transaction.commit();

        return true;
    } catch (error) {
        if (
            !transaction.finished
        ) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Get Task Assignments ========================= */

const getTaskAssignments = async (
    uuid
) => {
    const task =
        await adminTaskRepository.findByUuid(
            uuid
        );

    if (!task) {
        throw new ApiError(
            404,
            "Task not found."
        );
    }

    return adminTaskRepository.getTaskAssignments(
        task.id
    );
};

/* ========================= Exports ========================= */

module.exports = {
    createTask,
    getTask,
    getTasks,
    updateTask,
    updateTaskPriority,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    forceDeleteTask,
    getTrashTasks,
    addTaskAssignment,
    removeTaskAssignment,
    getTaskAssignments,
};