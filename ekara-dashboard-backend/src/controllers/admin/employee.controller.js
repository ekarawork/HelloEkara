"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminEmployeeService,
} = require("../../services/index");

const {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeStatusSchema,
} = require("../../validations/admin/employee.validation");

/* ========================= Create Employee ========================= */

const createEmployee = asyncHandler(async (req, res) => {
    const { error, value } =
        createEmployeeSchema.validate(req.body, {
            abortEarly: true,
            convert: true,
        });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    /* ========================= Files ========================= */

    const files = {
        profile_image:
            req.files?.profile_image || [],
    };

    /* ========================= Create Employee ========================= */

    const employee =
        await adminEmployeeService.createEmployee(
            value,
            files,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Employee created successfully.",
        employee,
        201
    );
});

/* ========================= Get Employees ========================= */

const getEmployees = asyncHandler(async (req, res) => {
    const employees =
        await adminEmployeeService.getEmployees({
            page:
                Number(req.query.page) || 1,

            limit:
                Number(req.query.limit) || 10,

            search:
                req.query.search || "",

            status:
                req.query.status,

            department:
                req.query.department,

            designation:
                req.query.designation,

            role:
                req.query.role,

            employment_type:
                req.query.employment_type,

            sortBy:
                req.query.sortBy || "createdAt",

            sortOrder:
                req.query.sortOrder || "DESC",
        });

    return ResponseHelper.success(
        res,
        "Employees fetched successfully.",
        employees
    );
});

/* ========================= Get Employee Details ========================= */

const getEmployee = asyncHandler(async (req, res) => {
    const employee =
        await adminEmployeeService.getEmployee(
            req.params.uuid
        );

    return ResponseHelper.success(
        res,
        "Employee fetched successfully.",
        employee
    );
});

/* ========================= Update Employee ========================= */

const updateEmployee = asyncHandler(async (req, res) => {
    const { error, value } =
        updateEmployeeSchema.validate(req.body, {
            abortEarly: true,
            convert: true,
        });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    /* ========================= Files ========================= */

    const files = {
        profile_image:
            req.files?.profile_image || [],
    };

    /* ========================= Update Employee ========================= */

    const employee =
        await adminEmployeeService.updateEmployee(
            req.params.uuid,
            value,
            files,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Employee updated successfully.",
        employee
    );
});

/* ========================= Update Employee Status ========================= */

const updateEmployeeStatus = asyncHandler(
    async (req, res) => {
        const { error, value } =
            employeeStatusSchema.validate(
                req.body,
                {
                    abortEarly: true,
                    convert: true,
                }
            );

        if (error) {
            return ResponseHelper.error(
                res,
                error.details[0].message,
                null,
                422
            );
        }

        const employee =
            await adminEmployeeService.updateEmployeeStatus(
                req.params.uuid,
                value.status,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Employee status updated successfully.",
            employee
        );
    }
);

/* ========================= Soft Delete Employee ========================= */

const deleteEmployee = asyncHandler(async (req, res) => {
    await adminEmployeeService.deleteEmployee(
        req.params.uuid
    );

    return ResponseHelper.success(
        res,
        "Employee deleted successfully."
    );
});

/* ========================= Restore Employee ========================= */

const restoreEmployee = asyncHandler(async (req, res) => {
    const employee =
        await adminEmployeeService.restoreEmployee(
            req.params.uuid,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Employee restored successfully.",
        employee
    );
});

/* ========================= Force Delete Employee ========================= */

const forceDeleteEmployee = asyncHandler(
    async (req, res) => {
        const result =
            await adminEmployeeService.forceDeleteEmployee(
                req.params.uuid
            );

        return ResponseHelper.success(
            res,
            "Employee permanently deleted.",
            result
        );
    }
);

/* ========================= Get Trash Employees ========================= */

const getTrashEmployees = asyncHandler(
    async (req, res) => {
        const result =
            await adminEmployeeService.getTrashEmployees({
                page:
                    Number(req.query.page) || 1,

                limit:
                    Number(req.query.limit) || 10,

                search:
                    req.query.search || "",
            });

        return ResponseHelper.success(
            res,
            "Trash employees fetched successfully.",
            result
        );
    }
);

/* ========================= Exports ========================= */

module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    updateEmployeeStatus,
    deleteEmployee,
    restoreEmployee,
    forceDeleteEmployee,
    getTrashEmployees,
};