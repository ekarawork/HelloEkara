"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    clientmetaadsPerformanceService,
} = require("../../services/index");

/* =========================================================
   GET CLIENT META ADS DASHBOARD
========================================================= */

// Get Meta Ads dashboard for authenticated client
const getMetaAdsDashboard = asyncHandler(
    async (req, res) => {
        /* =====================================================
           CLIENT
        ===================================================== */

        const clientId =
            req.client?.id;

        /* =====================================================
           DASHBOARD DATA
        ===================================================== */

        const dashboard =
            await clientmetaadsPerformanceService.getClientMetaAdsDashboard(
                clientId,
                {
                    startDate:
                        req.query.startDate,

                    endDate:
                        req.query.endDate,
                }
            );

        /* =====================================================
           RESPONSE
        ===================================================== */

        return ResponseHelper.success(
            res,
            "Client Meta Ads dashboard fetched successfully.",
            dashboard
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getMetaAdsDashboard,
};