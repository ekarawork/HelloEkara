"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    employeeTaskService,
} = require("../../services/index");

const {
    employeeTaskListSchema,
    employeeTaskUuidSchema,
    employeeTaskStatusSchema,
    employeeTaskProgressSchema,
} = require("../../validations/employee/task.validation");

const {
    employee,
} = require("../../database/models");

/* ========================= Helpers ========================= */

const validateRequest = (schema, data) => {
    const {
        error,
        value,
    } = schema.validate(data, {
        abortEarly: true,
    });

    if (error) {
        return {
            error: error.details[0].message,
            value: null,
        };
    }

    return {
        error: null,
        value,
    };
};

/* ========================= Authenticated Employee Helper ========================= */

/**
 * Resolve employees.id from logged-in users.id.
 *
 * req.user.id belongs to users table.
 * task_assignments.employee_id belongs to employees table.
 */
const getAuthenticatedEmployeeId = async (req) => {
    const userId = req.user?.id;

    if (!userId) {
        return null;
    }

    const employeeRecord = await employee.findOne({
        where: {
            user_id: userId,
            status: "ACTIVE",
        },
        attributes: ["id", "user_id"],
    });

    return employeeRecord?.id || null;
};

/* ========================= Employee Tasks ========================= */

/**
 * Get assigned employee tasks
 *
 * GET /api/v1/employee/tasks
 */
/**
 * Get assigned employee tasks
 *
 * GET /api/v1/employee/tasks
 */
const getTasks = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = validateRequest(
            employeeTaskListSchema,
            req.query
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const result =
            await employeeTaskService.getTasks({
                employeeId,
                page: value.page,
                limit: value.limit,
                search: value.search,
                status: value.status,
                priority: value.priority,
                clientId: value.client_id,
                startDate: value.start_date,
                dueDate: value.due_date,
            });

        return ResponseHelper.success(
            res,
            "Employee tasks fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get assigned task details
 *
 * GET /api/v1/employee/tasks/:uuid
 */
const getTask = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const task =
            await employeeTaskService.getTask(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Employee task details fetched successfully.",
            task,
            200
        );
    }
);

/**
 * Update assigned task status
 *
 * PATCH /api/v1/employee/tasks/:uuid/status
 */
const updateTaskStatus = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskUuidSchema,
            req.params
        );

        if (uuidError) {
            return ResponseHelper.error(
                res,
                uuidError,
                null,
                422
            );
        }

        const {
            error: statusError,
            value: statusValue,
        } = validateRequest(
            employeeTaskStatusSchema,
            req.body
        );

        if (statusError) {
            return ResponseHelper.error(
                res,
                statusError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const task =
            await employeeTaskService.updateTaskStatus(
                uuidValue.uuid,
                employeeId,
                statusValue.status
            );

        return ResponseHelper.success(
            res,
            "Task status updated successfully.",
            task,
            200
        );
    }
);

/**
 * Update assigned task progress
 *
 * PATCH /api/v1/employee/tasks/:uuid/progress
 */
const updateTaskProgress = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskUuidSchema,
            req.params
        );

        if (uuidError) {
            return ResponseHelper.error(
                res,
                uuidError,
                null,
                422
            );
        }

        const {
            error: progressError,
            value: progressValue,
        } = validateRequest(
            employeeTaskProgressSchema,
            req.body
        );

        if (progressError) {
            return ResponseHelper.error(
                res,
                progressError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const task =
            await employeeTaskService.updateTaskProgress(
                uuidValue.uuid,
                employeeId,
                progressValue.progress
            );

        return ResponseHelper.success(
            res,
            "Task progress updated successfully.",
            task,
            200
        );
    }
);

/**
 * Get latest message of a task
 *
 * GET /api/v1/employee/tasks/:uuid/messages/latest
 */
const getLatestTaskMessage = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const message =
            await employeeTaskService.getLatestTaskMessage(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Latest task message fetched successfully.",
            message,
            200
        );
    }
);

/**
 * Count task messages
 *
 * GET /api/v1/employee/tasks/:uuid/messages/count
 */
const countTaskMessages = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const count =
            await employeeTaskService.countTaskMessages(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task message count fetched successfully.",
            { count },
            200
        );
    }
);

/* ========================= Exports ========================= */

module.exports = {
    getTasks,
    getTask,
    updateTaskStatus,
    updateTaskProgress,
    getLatestTaskMessage,
    countTaskMessages,
};