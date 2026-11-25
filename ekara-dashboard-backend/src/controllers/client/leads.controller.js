"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    clientLeadsService,
} = require("../../services/index");

/* =========================================================
   GET CLIENT LEADS DASHBOARD
========================================================= */

// Get Leads dashboard for authenticated client
const getLeadsDashboard = asyncHandler(
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
            await clientLeadsService.getClientLeadsDashboard(
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
            "Client Leads dashboard fetched successfully.",
            dashboard
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getLeadsDashboard,
};