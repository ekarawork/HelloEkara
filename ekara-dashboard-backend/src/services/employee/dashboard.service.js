"use strict";

const {
    employeeDashboardRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

const logger = require("../../utils/winston.util");

/* =========================================================
   Constants
   ========================================================= */

const DEFAULT_RECENT_TASKS_LIMIT = 5;
const DEFAULT_UPCOMING_TASKS_LIMIT = 5;
const DEFAULT_OVERDUE_TASKS_LIMIT = 5;

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Convert value into a positive integer.
 */
const toPositiveInteger = (
    value,
    fallback = null
) => {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
        return fallback;
    }

    return number;
};

/**
 * Normalize limit.
 */
const normalizeLimit = (
    value,
    fallback = 5,
    max = 20
) => {
    const normalizedValue = toPositiveInteger(
        value,
        fallback
    );

    return Math.min(
        max,
        Math.max(1, normalizedValue)
    );
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
 * Get today's date in YYYY-MM-DD format.
 *
 * Uses server's local date.
 */
const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Get date after a specific number of days.
 */
const getDateAfterDays = (
    date,
    days
) => {
    const result = new Date(`${date}T00:00:00`);

    result.setDate(
        result.getDate() + days
    );

    const year = result.getFullYear();
    const month = String(
        result.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        result.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Sanitize task object.
 *
 * Dashboard only returns safe task-related data.
 */
const sanitizeDashboardTask = (
    taskData
) => {
    if (!taskData) {
        return taskData;
    }

    const task =
        typeof taskData.toJSON === "function"
            ? taskData.toJSON()
            : { ...taskData };

    /*
     * Keep only required dashboard fields.
     */
    const sanitizedTask = {
        id: task.id,
        uuid: task.uuid,
        task_code: task.task_code,
        title: task.title,
        priority: task.priority,
        status: task.status,
        start_date: task.start_date,
        due_date: task.due_date,
        progress: Number(task.progress || 0),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };

    if (task.client) {
        sanitizedTask.client = {
            id: task.client.id,
            uuid: task.client.uuid,
            name: task.client.name,
            status: task.client.status,
        };
    } else {
        sanitizedTask.client = null;
    }

    if (Array.isArray(task.assignments)) {
        sanitizedTask.assignments =
            task.assignments.map((assignment) => ({
                id: assignment.id,
                uuid: assignment.uuid,
                employee_id: assignment.employee_id,
                assigned_by: assignment.assigned_by,
                assigned_at: assignment.assigned_at,
            }));
    } else {
        sanitizedTask.assignments = [];
    }

    return sanitizedTask;
};

/**
 * Sanitize task rows.
 */
const sanitizeDashboardTasks = (
    tasks = []
) => {
    return tasks.map(sanitizeDashboardTask);
};

/**
 * Normalize summary values.
 */
const normalizeSummary = (
    summary = {}
) => {
    return {
        totalTasks: Number(
            summary.totalTasks || 0
        ),
        todoTasks: Number(
            summary.todoTasks || 0
        ),
        inProgressTasks: Number(
            summary.inProgressTasks || 0
        ),
        inReviewTasks: Number(
            summary.inReviewTasks || 0
        ),
        completedTasks: Number(
            summary.completedTasks || 0
        ),
    };
};

/**
 * Normalize status overview.
 */
const normalizeStatusOverview = (
    overview = {}
) => {
    return {
        TODO: Number(
            overview.TODO || 0
        ),
        IN_PROGRESS: Number(
            overview.IN_PROGRESS || 0
        ),
        IN_REVIEW: Number(
            overview.IN_REVIEW || 0
        ),
        COMPLETED: Number(
            overview.COMPLETED || 0
        ),
    };
};

/* =========================================================
   Get Employee Dashboard
   ========================================================= */

/**
 * Get dashboard data for logged-in employee.
 *
 * Includes:
 * - Task summary
 * - Recent tasks
 * - Upcoming deadlines
 * - Overdue tasks
 * - Task status overview
 */
const getDashboard = async ({
    employeeId,
    recentLimit = DEFAULT_RECENT_TASKS_LIMIT,
    upcomingLimit = DEFAULT_UPCOMING_TASKS_LIMIT,
    overdueLimit = DEFAULT_OVERDUE_TASKS_LIMIT,
} = {}) => {
    const normalizedEmployeeId = validateEmployeeId(
        employeeId
    );

    const normalizedRecentLimit = normalizeLimit(
        recentLimit,
        DEFAULT_RECENT_TASKS_LIMIT
    );

    const normalizedUpcomingLimit = normalizeLimit(
        upcomingLimit,
        DEFAULT_UPCOMING_TASKS_LIMIT
    );

    const normalizedOverdueLimit = normalizeLimit(
        overdueLimit,
        DEFAULT_OVERDUE_TASKS_LIMIT
    );

    const today = getTodayDate();
    const upcomingDate = getDateAfterDays(
        today,
        7
    );

    try {
        const [
            summary,
            recentTasks,
            upcomingTasks,
            overdueTasks,
            statusOverview,
        ] = await Promise.all([
            employeeDashboardRepository.getEmployeeTaskSummary(
                normalizedEmployeeId
            ),

            employeeDashboardRepository.getRecentEmployeeTasks({
                employeeId: normalizedEmployeeId,
                limit: normalizedRecentLimit,
            }),

            employeeDashboardRepository.getUpcomingEmployeeTasks({
                employeeId: normalizedEmployeeId,
                fromDate: today,
                toDate: upcomingDate,
                limit: normalizedUpcomingLimit,
            }),

            employeeDashboardRepository.getOverdueEmployeeTasks({
                employeeId: normalizedEmployeeId,
                today,
                limit: normalizedOverdueLimit,
            }),

            employeeDashboardRepository.getEmployeeTaskStatusOverview(
                normalizedEmployeeId
            ),
        ]);

        return {
            summary: normalizeSummary(
                summary
            ),

            recentTasks: sanitizeDashboardTasks(
                recentTasks
            ),

            upcomingDeadlines: sanitizeDashboardTasks(
                upcomingTasks
            ),

            overdueTasks: sanitizeDashboardTasks(
                overdueTasks
            ),

            taskStatusOverview: normalizeStatusOverview(
                statusOverview
            ),

            meta: {
                today,
                upcomingUntil: upcomingDate,
            },
        };
    } catch (error) {
        logger.error(
            "Failed to load employee dashboard",
            {
                employeeId: normalizedEmployeeId,
                error: error.message,
                stack: error.stack,
            }
        );

        throw error;
    }
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    getDashboard,

    validateEmployeeId,
    sanitizeDashboardTask,
    sanitizeDashboardTasks,

    getTodayDate,
    getDateAfterDays,
};