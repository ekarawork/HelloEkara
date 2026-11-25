"use strict";

const { Op } = require("sequelize");

const {
    task,
    task_assignment,
    task_message,
    task_attachment,
    client,
    employee,
    user,
} = require("../../database/models");

/* ========================= Task ========================= */

// Create task
const createTask = async (
    payload,
    transaction
) => {
    return await task.create(
        payload,
        {
            transaction,
        }
    );
};

// Find task by ID
const findById = async (
    id,
    options = {}
) => {
    return await task.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find task by UUID
const findByUuid = async (
    uuid,
    options = {}
) => {
    return await task.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

// Find task by task code
const findByTaskCode = async (
    task_code,
    options = {}
) => {
    return await task.findOne({
        where: {
            task_code,
        },
        ...options,
    });
};

// Update task
const updateTask = async (
    taskData,
    payload,
    transaction
) => {
    return await taskData.update(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= Task List ========================= */

const getTasks = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
    priority,
    client_id,
    employee_id,
}) => {
    const offset =
        (page - 1) * limit;

    const where = {};

    /* ========================= Search ========================= */

    if (search) {
        where[Op.or] = [
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

    /* ========================= Filters ========================= */

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (client_id) {
        where.client_id = client_id;
    }

    /* ========================= Employee Filter ========================= */

    const assignmentWhere =
        employee_id
            ? {
                  employee_id,
              }
            : undefined;

    /* ========================= Query ========================= */

    const {
        count,
        rows,
    } = await task.findAndCountAll({
        where,

        include: [
            {
                model: client,
                as: "client",
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
                required: false,
            },

            {
                model: task_assignment,
                as: "assignments",
                where: assignmentWhere,
                required: !!employee_id,

                include: [
                    {
                        model: employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "uuid",
                            "first_name",
                            "last_name",
                            "email",
                            "employee_code",
                            "department",
                            "designation",
                            "profile_image",
                            "status",
                        ],
                        required: false,
                    },
                ],
            },
        ],

        distinct: true,

        offset,
        limit,

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(
                count / limit
            ),
    };
};

/* ========================= Task Details ========================= */

const getTaskDetails = async (
    uuid
) => {
    return await task.findOne({
        where: {
            uuid,
        },

        include: [
            /* ========================= Client ========================= */

            {
                model: client,
                as: "client",
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
                required: false,
            },

            /* ========================= Created By ========================= */

            {
                model: user,
                as: "createdBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                ],
                required: false,
            },

            /* ========================= Updated By ========================= */

            {
                model: user,
                as: "updatedBy",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                ],
                required: false,
            },

            /* ========================= Assignments ========================= */

            {
                model: task_assignment,
                as: "assignments",

                include: [
                    {
                        model: employee,
                        as: "employee",
                        attributes: [
                            "id",
                            "uuid",
                            "first_name",
                            "last_name",
                            "email",
                            "employee_code",
                            "department",
                            "designation",
                            "profile_image",
                            "status",
                        ],
                        required: false,
                    },

                    {
                        model: user,
                        as: "assignedBy",
                        attributes: [
                            "id",
                            "uuid",
                            "email",
                            "role",
                        ],
                        required: false,
                    },
                ],
            },

            /* ========================= Messages ========================= */

            {
                model: task_message,
                as: "messages",

                include: [
                    {
                        model: user,
                        as: "sender",
                        attributes: [
                            "id",
                            "uuid",
                            "email",
                            "role",
                        ],
                        required: false,
                    },

                    {
                        model: task_attachment,
                        as: "attachments",
                        required: false,
                    },
                ],

                separate: true,

                order: [
                    ["createdAt", "ASC"],
                ],
            },

            /* ========================= Attachments ========================= */

            {
                model: task_attachment,
                as: "attachments",
                required: false,

                include: [
                    {
                        model: user,
                        as: "uploadedBy",
                        attributes: [
                            "id",
                            "uuid",
                            "email",
                            "role",
                        ],
                        required: false,
                    },
                ],
            },
        ],
    });
};

/* ========================= Task Priority ========================= */

// Update task priority
const updateTaskPriority = async (
    uuid,
    priority,
    userId,
    transaction
) => {
    const taskData =
        await task.findOne({
            where: {
                uuid,
            },
            transaction,
        });

    if (!taskData) {
        return null;
    }

    await taskData.update(
        {
            priority,
            updated_by: userId,
        },
        {
            transaction,
        }
    );

    return taskData;
};

/* ========================= Task Status ========================= */

// Update task status
const updateTaskStatus = async (
    uuid,
    status,
    userId,
    transaction
) => {
    const taskData =
        await task.findOne({
            where: {
                uuid,
            },
            transaction,
        });

    if (!taskData) {
        return null;
    }

    const updatePayload = {
        status,
        updated_by: userId,
    };

    /* ========================= Completion ========================= */

    if (status === "COMPLETED") {
        updatePayload.completed_at =
            new Date();

        updatePayload.progress = 100;
    } else {
        updatePayload.completed_at = null;
    }

    await taskData.update(
        updatePayload,
        {
            transaction,
        }
    );

    return taskData;
};

/* ========================= Soft Delete ========================= */

// Soft delete task
const deleteTask = async (
    taskData,
    transaction
) => {
    return await taskData.destroy({
        transaction,
    });
};

/* ========================= Deleted Task ========================= */

// Find deleted task
const findDeletedByUuid = async (
    uuid
) => {
    return await task.findOne({
        where: {
            uuid,
        },
        paranoid: false,
    });
};

/* ========================= Restore Task ========================= */

// Restore task
const restoreTask = async (
    uuid,
    userId,
    transaction
) => {
    const taskData =
        await task.findOne({
            where: {
                uuid,
                deleted_at: {
                    [Op.ne]: null,
                },
            },
            paranoid: false,
            transaction,
        });

    if (!taskData) {
        return null;
    }

    await taskData.restore({
        transaction,
    });

    await taskData.update(
        {
            updated_by: userId,
        },
        {
            transaction,
        }
    );

    await taskData.reload({
        transaction,
        paranoid: false,
    });

    return taskData;
};

/* ========================= Force Delete ========================= */

// Permanently delete task
const forceDeleteTask = async (
    taskData,
    transaction
) => {
    return await taskData.destroy({
        force: true,
        transaction,
    });
};

/* ========================= Trash Tasks ========================= */

const getTrashTasks = async ({
    page = 1,
    limit = 10,
    search = "",
    priority,
    status,
    client_id,
}) => {
    const offset =
        (page - 1) * limit;

    const where = {
        deleted_at: {
            [Op.ne]: null,
        },
    };

    /* ========================= Search ========================= */

    if (search) {
        where[Op.or] = [
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

    /* ========================= Filters ========================= */

    if (priority) {
        where.priority = priority;
    }

    if (status) {
        where.status = status;
    }

    if (client_id) {
        where.client_id = client_id;
    }

    /* ========================= Query ========================= */

    const {
        count,
        rows,
    } = await task.findAndCountAll({
        where,

        paranoid: false,

        include: [
            {
                model: client,
                as: "client",
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
                required: false,
            },

            {
                model: task_assignment,
                as: "assignments",

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
                            "profile_image",
                            "status",
                        ],
                        required: false,
                    },
                ],

                required: false,
            },
        ],

        distinct: true,

        offset,
        limit,

        order: [
            ["deleted_at", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(
                count / limit
            ),
    };
};

/* ========================= Task Assignment ========================= */

// Create task assignment
const createTaskAssignment = async (
    payload,
    transaction
) => {
    return await task_assignment.create(
        payload,
        {
            transaction,
        }
    );
};

// Find assignment by ID
const findAssignmentById = async (
    id,
    options = {}
) => {
    return await task_assignment.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find assignment by task + employee
const findTaskEmployeeAssignment = async (
    taskId,
    employeeId,
    options = {}
) => {
    return await task_assignment.findOne({
        where: {
            task_id: taskId,
            employee_id: employeeId,
        },
        ...options,
    });
};

// Get task assignments
const getTaskAssignments = async (
    taskId,
    options = {}
) => {
    return await task_assignment.findAll({
        where: {
            task_id: taskId,
        },

        include: [
            {
                model: employee,
                as: "employee",
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                    "employee_code",
                    "department",
                    "designation",
                    "profile_image",
                    "status",
                ],
                required: false,
            },
        ],

        order: [
            ["assigned_at", "DESC"],
        ],

        ...options,
    });
};

// Delete task assignment
const deleteTaskAssignment = async (
    assignmentData,
    transaction
) => {
    return await assignmentData.destroy({
        transaction,
    });
};

/* ========================= Find Client ========================= */

const findClientById = async (
    id,
    options = {}
) => {
    return client.findByPk(
        id,
        {
            ...options,
        }
    );
};

/* ========================= Find Employee ========================= */

const findEmployeeById = async (
    id,
    options = {}
) => {
    return employee.findByPk(
        id,
        {
            ...options,
        }
    );
};

const findUserById = async (
    id,
    options = {}
) => {
    return await user.findByPk(
        id,
        {
            ...options,
        }
    );
};
/* ========================= Exports ========================= */

module.exports = {
    createTask,

    findById,
    findByUuid,
    findByTaskCode,

    updateTask,

    getTasks,
    getTaskDetails,

    updateTaskPriority,
    updateTaskStatus,

    deleteTask,
    findDeletedByUuid,
    restoreTask,
    forceDeleteTask,
    getTrashTasks,

    createTaskAssignment,
    findAssignmentById,
    findTaskEmployeeAssignment,
    getTaskAssignments,
    deleteTaskAssignment,

    findClientById,
    findEmployeeById,
    findUserById
};