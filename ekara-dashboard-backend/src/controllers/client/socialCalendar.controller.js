"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    clientSocialCalendarService,
} = require("../../services/index");

/* ========================= Get Social Calendar Dashboard ========================= */

// Get social calendar dashboard for authenticated client
const getSocialCalendarDashboard =
    asyncHandler(async (req, res) => {
        /* =========================================================
           AUTHENTICATED CLIENT
        ========================================================= */

        const clientId =
            req.client?.id;

        /* =========================================================
           QUERY
        ========================================================= */

        const query = {
            startDate:
                req.query.startDate ||
                undefined,

            endDate:
                req.query.endDate ||
                undefined,

            platform:
                req.query.platform ||
                undefined,

            status:
                req.query.status ||
                undefined,

            contentType:
                req.query.contentType ||
                undefined,
        };

        /* =========================================================
           SERVICE
        ========================================================= */

        const dashboard =
            await clientSocialCalendarService.getClientSocialCalendarDashboard(
                clientId,
                query
            );

        /* =========================================================
           RESPONSE
        ========================================================= */

        return ResponseHelper.success(
            res,
            "Client Social Calendar dashboard fetched successfully.",
            dashboard
        );
    });

/* ========================= Export ========================= */

module.exports = {
    getSocialCalendarDashboard,
};