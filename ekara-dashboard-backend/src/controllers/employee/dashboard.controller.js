"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    employeeDashboardService,
} = require("../../services/index");

const {
    employeeDashboardQuerySchema,
} = require("../../validations/employee/dashboard.validation");

const {
    employee,
} = require("../../database/models");

/* ========================= Helpers ========================= */

/**
 * Validate request data using Joi schema.
 */
const validateRequest = (
    schema,
    data
) => {
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
const getAuthenticatedEmployeeId = async (
    req
) => {
    const userId = req.user?.id;

    if (!userId) {
        return null;
    }

    const employeeRecord = await employee.findOne({
        where: {
            user_id: userId,
            status: "ACTIVE",
        },
        attributes: [
            "id",
            "user_id",
        ],
    });

    return employeeRecord?.id || null;
};

/* ========================= Employee Dashboard ========================= */

/**
 * Get employee dashboard.
 *
 * GET /api/v1/employee/dashboard
 *
 * Optional query parameters:
 * - recent_limit
 * - upcoming_limit
 * - overdue_limit
 */
const getDashboard = asyncHandler(
    async (req, res) => {
        const {
            error,
            value,
        } = validateRequest(
            employeeDashboardQuerySchema,
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

        const dashboard =
            await employeeDashboardService.getDashboard({
                employeeId,
                recentLimit: value.recent_limit,
                upcomingLimit: value.upcoming_limit,
                overdueLimit: value.overdue_limit,
            });

        return ResponseHelper.success(
            res,
            "Employee dashboard fetched successfully.",
            dashboard,
            200
        );
    }
);

/* ========================= Exports ========================= */

module.exports = {
    getDashboard,
};