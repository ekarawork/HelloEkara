"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    employeeSettingsService,
} = require("../../services/index");

const {
    updateEmployeeProfileSchema,
    changeEmployeePasswordSchema,
} = require("../../validations/employee/settings.validation");

/* =========================================================
   GET EMPLOYEE PROFILE
========================================================= */

const getEmployeeProfile = asyncHandler(
    async (req, res) => {

        const result =
            await employeeSettingsService.getEmployeeProfile(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Employee profile fetched successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   UPDATE EMPLOYEE PROFILE
========================================================= */

const updateEmployeeProfile = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = updateEmployeeProfileSchema.validate(
            req.body,
            {
                abortEarly: true,
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

        const result =
            await employeeSettingsService.updateEmployeeProfile(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Employee profile updated successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   CHANGE EMPLOYEE PASSWORD
========================================================= */

const changeEmployeePassword = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = changeEmployeePasswordSchema.validate(
            req.body,
            {
                abortEarly: true,
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

        const result =
            await employeeSettingsService.changeEmployeePassword(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Password updated successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getEmployeeProfile,
    updateEmployeeProfile,
    changeEmployeePassword,
};