"use strict";

const asyncHandler =
    require("../../middleware/asyncHandler");

const ResponseHelper =
    require("../../helpers/response.helper");

const {
    clientPaymentsService,
} = require("../../services/index");

/* =========================================================
   GET CLIENT PAYMENT DASHBOARD
========================================================= */

// Get Payment dashboard for authenticated client
const getPaymentDashboard =
    asyncHandler(
        async (req, res) => {
            /* =================================================
               CLIENT
            ================================================= */

            const clientId =
                req.client?.id;

            /* =================================================
               DASHBOARD DATA
            ================================================= */

            const dashboard =
                await clientPaymentsService
                    .getClientPaymentDashboard(
                        clientId,
                        {
                            paymentMonth:
                                req.query
                                    .paymentMonth,
                        }
                    );

            /* =================================================
               RESPONSE
            ================================================= */

            return ResponseHelper.success(
                res,
                "Client Payment dashboard fetched successfully.",
                dashboard
            );
        }
    );

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getPaymentDashboard,
};