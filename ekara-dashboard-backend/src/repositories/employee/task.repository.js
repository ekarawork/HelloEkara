"use strict";

const {
    task,
    task_assignment,
    task_message,
    task_attachment,
    client,
    employee,
    user,
} = require("../../database/models");

const { Op } = require("sequelize");

const findById = async (id, options = {}) => {
    return task.findByPk(id, {
        ...options,
    });
};

const findByUuid = async (uuid, options = {}) => {
    return task.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/* =========================================================
   Employee Assignment Access
   ========================================================= */
const findEmployeeAssignment = async (
    taskId,
    employeeId,
    options = {}
) => {
    return task_assignment.findOne({
        where: {
            task_id: taskId,
            employee_id: employeeId,
        },
        ...options,
    });
};

const isEmployeeAssignedToTask = async (
    taskId,
    employeeId,
    options = {}
) => {
    const assignment = await findEmployeeAssignment(
        taskId,
        employeeId,
        options
    );

    return Boolean(assignment);
};

const findEmployeeTaskByUuid = async (
    uuid,
    employeeId,
    options = {}
) => {
    const include = Array.isArray(options.include)
        ? [...options.include]
        : [];

    include.push({
        model: task_assignment,
        as: "assignments",
        required: true,
        where: {
            employee_id: employeeId,
        },
        attributes: [
            "id",
            "uuid",
            "task_id",
            "employee_id",
            "assigned_by",
            "assigned_at",
        ],
    });

    return task.findOne({
        ...options,
        where: {
            ...(options.where || {}),
            uuid,
        },
        include,
    });
};

/* =========================================================
   Employee Task List
   ========================================================= */
const getEmployeeTasks = async ({
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
    const offset = (page - 1) * limit;

    const taskWhere = {};

    /* =========================
       Task filters
       ========================= */

    if (status) {
        taskWhere.status = status;
    }

    if (priority) {
        taskWhere.priority = priority;
    }

    if (clientId) {
        taskWhere.client_id = clientId;
    }

    if (startDate) {
        taskWhere.start_date = {
            [Op.gte]: startDate,
        };
    }

    if (dueDate) {
        taskWhere.due_date = {
            [Op.lte]: dueDate,
        };
    }

    /* =========================
       Search filter
       ========================= */

    if (search) {
        taskWhere[Op.or] = [
            {
                title: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                task_code: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                description: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    /* =========================
       Employee assignment
       ========================= */

    const result = await task.findAndCountAll({
        where: taskWhere,
        include: [
            {
                model: task_assignment,
                as: "assignments",
                required: true,
                where: {
                    employee_id: employeeId,
                },
                attributes: [
                    "id",
                    "uuid",
                    "task_id",
                    "employee_id",
                    "assigned_by",
                    "assigned_at",
                ],
                include: [
                    {
                        model: employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "uuid",
                            "first_name",
                            "last_name",
                            "designation",
                            "department",
                            "profile_image",
                            "status",
                        ],
                    },
                ],
            },
            {
                model: client,
                as: "client",
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "email",
                    "status",
                ],
                required: false,
            },
        ],
        distinct: true,
        limit,
        offset,
        order: [
            ["due_date", "ASC"],
            ["createdAt", "DESC"],
        ],
    });

    return {
        rows: result.rows,
        count: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit),
    };
};

/* =========================================================
   Employee Task Details
   ========================================================= */

const getEmployeeTaskDetails = async (
    uuid,
    employeeId,
    options = {}
) => {
    return task.findOne({
        ...options,
        where: {
            ...(options.where || {}),
            uuid,
        },
        include: [
            {
                model: task_assignment,
                as: "assignments",
                required: true,
                where: {
                    employee_id: employeeId,
                },
                attributes: [
                    "id",
                    "uuid",
                    "task_id",
                    "employee_id",
                    "assigned_by",
                    "assigned_at",
                ],
                include: [
                    {
                        model: employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "uuid",
                            "first_name",
                            "last_name",
                            "designation",
                            "department",
                            "profile_image",
                            "status",
                        ],
                    },
                    {
                        model: user,
                        as: "assignedBy",
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
            },
            {
                model: client,
                as: "client",
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "email",
                    "status",
                ],
                required: false,
            },
            {
                model: user,
                as: "createdBy",
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
                model: user,
                as: "updatedBy",
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
                model: task_message,
                as: "messages",
                separate: true,
                required: false,
                order: [["createdAt", "ASC"]],
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
            },
            {
                model: task_attachment,
                as: "attachments",
                separate: true,
                required: false,
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
            },
        ],
    });
};

/* =========================================================
   Task Update
   ========================================================= */
const updateTask = async (
    taskId,
    data,
    options = {}
) => {
    const [updatedCount] = await task.update(
        data,
        {
            where: {
                id: taskId,
            },
            ...options,
        }
    );

    return updatedCount;
};

/**
 * Update task status.
 */
const updateTaskStatus = async (
    taskId,
    status,
    data = {},
    options = {}
) => {
    const updateData = {
        status,
        ...data,
    };

    return updateTask(
        taskId,
        updateData,
        options
    );
};

/**
 * Update task progress.
 */
const updateTaskProgress = async (
    taskId,
    progress,
    options = {}
) => {
    return updateTask(
        taskId,
        {
            progress,
        },
        options
    );
};

/* =========================================================
   Task Messages Summary
   ========================================================= */
const getLatestTaskMessage = async (
    taskId,
    options = {}
) => {
    return task_message.findOne({
        where: {
            task_id: taskId,
        },
        order: [["createdAt", "DESC"]],
        ...options,
    });
};

const countTaskMessages = async (
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

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    findById,
    findByUuid,

    findEmployeeAssignment,
    isEmployeeAssignedToTask,
    findEmployeeTaskByUuid,

    getEmployeeTasks,
    getEmployeeTaskDetails,

    updateTask,
    updateTaskStatus,
    updateTaskProgress,

    getLatestTaskMessage,
    countTaskMessages,
};