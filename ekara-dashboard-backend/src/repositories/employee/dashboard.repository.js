"use strict";

const {
    task,
    task_assignment,
    client,
} = require("../../database/models");

const { Op, Sequelize } = require("sequelize");

/* =========================================================
   Employee Task Summary
   ========================================================= */

/**
 * Get task summary for a specific employee.
 *
 * Summary includes:
 * - Total assigned tasks
 * - TODO tasks
 * - IN_PROGRESS tasks
 * - IN_REVIEW tasks
 * - COMPLETED tasks
 */
const getEmployeeTaskSummary = async (
    employeeId,
    options = {}
) => {
    const where = {
        employee_id: employeeId,
    };

    const taskWhere = {
        ...options.taskWhere,
    };

    const result = await task_assignment.findOne({
        where,
        attributes: [
            [
                Sequelize.fn(
                    "COUNT",
                    Sequelize.col("task.id")
                ),
                "totalTasks",
            ],
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(
                        "CASE WHEN task.status = 'TODO' THEN 1 ELSE 0 END"
                    )
                ),
                "todoTasks",
            ],
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(
                        "CASE WHEN task.status = 'IN_PROGRESS' THEN 1 ELSE 0 END"
                    )
                ),
                "inProgressTasks",
            ],
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(
                        "CASE WHEN task.status = 'IN_REVIEW' THEN 1 ELSE 0 END"
                    )
                ),
                "inReviewTasks",
            ],
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(
                        "CASE WHEN task.status = 'COMPLETED' THEN 1 ELSE 0 END"
                    )
                ),
                "completedTasks",
            ],
        ],
        include: [
            {
                model: task,
                as: "task",
                required: true,
                attributes: [],
                where: taskWhere,
            },
        ],
        raw: true,
    });

    return {
        totalTasks: Number(result?.totalTasks || 0),
        todoTasks: Number(result?.todoTasks || 0),
        inProgressTasks: Number(
            result?.inProgressTasks || 0
        ),
        inReviewTasks: Number(
            result?.inReviewTasks || 0
        ),
        completedTasks: Number(
            result?.completedTasks || 0
        ),
    };
};

/* =========================================================
   Recent Assigned Tasks
   ========================================================= */

/**
 * Get recently assigned tasks for an employee.
 */
const getRecentEmployeeTasks = async ({
    employeeId,
    limit = 5,
} = {}) => {
    return task.findAll({
        attributes: [
            "id",
            "uuid",
            "task_code",
            "title",
            "priority",
            "status",
            "start_date",
            "due_date",
            "progress",
            "createdAt",
            "updatedAt",
        ],
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
                    "employee_id",
                    "assigned_by",
                    "assigned_at",
                ],
            },
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "status",
                ],
            },
        ],
        order: [
            ["createdAt", "DESC"],
        ],
        limit,
    });
};

/* =========================================================
   Upcoming Deadlines
   ========================================================= */

/**
 * Get upcoming tasks for an employee.
 *
 * Includes:
 * - Tasks with a due date
 * - Not completed
 * - Due today or within the requested number of days
 */
const getUpcomingEmployeeTasks = async ({
    employeeId,
    fromDate,
    toDate,
    limit = 5,
} = {}) => {
    const taskWhere = {
        due_date: {
            [Op.between]: [fromDate, toDate],
        },
        status: {
            [Op.ne]: "COMPLETED",
        },
    };

    return task.findAll({
        attributes: [
            "id",
            "uuid",
            "task_code",
            "title",
            "priority",
            "status",
            "start_date",
            "due_date",
            "progress",
        ],
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
                    "employee_id",
                    "assigned_at",
                ],
            },
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "status",
                ],
            },
        ],
        order: [
            ["due_date", "ASC"],
            ["priority", "DESC"],
        ],
        limit,
    });
};

/* =========================================================
   Overdue Tasks
   ========================================================= */

/**
 * Get overdue tasks for an employee.
 *
 * Overdue means:
 * - due_date is before today
 * - status is not COMPLETED
 */
const getOverdueEmployeeTasks = async ({
    employeeId,
    today,
    limit = 5,
} = {}) => {
    return task.findAll({
        attributes: [
            "id",
            "uuid",
            "task_code",
            "title",
            "priority",
            "status",
            "start_date",
            "due_date",
            "progress",
        ],
        where: {
            due_date: {
                [Op.lt]: today,
            },
            status: {
                [Op.ne]: "COMPLETED",
            },
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
                    "employee_id",
                    "assigned_at",
                ],
            },
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "status",
                ],
            },
        ],
        order: [
            ["due_date", "ASC"],
            ["priority", "DESC"],
        ],
        limit,
    });
};

/* =========================================================
   Task Status Overview
   ========================================================= */

/**
 * Get task count grouped by status.
 *
 * This is useful for a chart or status overview.
 */
const getEmployeeTaskStatusOverview = async (
    employeeId
) => {
    const result = await task_assignment.findAll({
        where: {
            employee_id: employeeId,
        },
        attributes: [
            [
                Sequelize.col("task.status"),
                "status",
            ],
            [
                Sequelize.fn(
                    "COUNT",
                    Sequelize.col("task.id")
                ),
                "count",
            ],
        ],
        include: [
            {
                model: task,
                as: "task",
                required: true,
                attributes: [],
            },
        ],
        group: [
            Sequelize.col("task.status"),
        ],
        raw: true,
    });

    const overview = {
        TODO: 0,
        IN_PROGRESS: 0,
        IN_REVIEW: 0,
        COMPLETED: 0,
    };

    result.forEach((item) => {
        if (overview[item.status] !== undefined) {
            overview[item.status] = Number(
                item.count || 0
            );
        }
    });

    return overview;
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    getEmployeeTaskSummary,
    getRecentEmployeeTasks,
    getUpcomingEmployeeTasks,
    getOverdueEmployeeTasks,
    getEmployeeTaskStatusOverview,
};