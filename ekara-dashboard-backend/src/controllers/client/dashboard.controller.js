"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    clientDashboardService,
} = require("../../services/index");

/* =========================================================
   GET CLIENT DASHBOARD
========================================================= */

const getClientDashboard = asyncHandler(
    async (req, res) => {
        /* =====================================================
           AUTHENTICATED CLIENT
        ===================================================== */

        const clientId =
            req.client?.id;

        /* =====================================================
           QUERY PARAMETERS
        ===================================================== */

        const query = {
            startDate:
                req.query.startDate ||
                undefined,

            endDate:
                req.query.endDate ||
                undefined,
        };

        /* =====================================================
           FETCH DASHBOARD
        ===================================================== */

        const dashboard =
            await clientDashboardService.getClientDashboard(
                clientId,
                query
            );

        /* =====================================================
           SUCCESS RESPONSE
        ===================================================== */

        return ResponseHelper.success(
            res,
            "Client dashboard fetched successfully.",
            dashboard
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientDashboard,
};