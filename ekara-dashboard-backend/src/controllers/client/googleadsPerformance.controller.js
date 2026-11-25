"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    clientGoogleAdsPerformanceService,
} = require("../../services/index");

/* =========================================================
   GET CLIENT GOOGLE ADS DASHBOARD
========================================================= */

// Get Google Ads dashboard for authenticated client
const getGoogleAdsDashboard = asyncHandler(
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
            await clientGoogleAdsPerformanceService.getClientGoogleAdsDashboard(
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
            "Client Google Ads dashboard fetched successfully.",
            dashboard
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getGoogleAdsDashboard,
};