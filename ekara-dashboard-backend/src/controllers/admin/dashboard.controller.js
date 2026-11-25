"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminDashboardService } = require("../../services/index");

const {
    getDashboardSchema,
} = require("../../validations/admin/dashboard.validation");

/* =========================================================
   GET ADMIN DASHBOARD
========================================================= */

const getDashboardData = asyncHandler(async (req, res) => {
    /* =====================================================
       VALIDATE QUERY
    ===================================================== */

    const { error, value } = getDashboardSchema.validate(
        req.query,
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

    /* =====================================================
       GET DASHBOARD DATA
    ===================================================== */

    const dashboardData =
        await adminDashboardService.getDashboardData(value);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return ResponseHelper.success(
        res,
        "Dashboard data fetched successfully.",
        dashboardData
    );
});

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getDashboardData,
};