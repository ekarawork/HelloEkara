"use strict";

const {
    clientPaymentsRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* =========================================================
   GET CLIENT PAYMENT DASHBOARD
========================================================= */

const getClientPaymentDashboard = async (
    clientId,
    {
        paymentMonth,
    } = {}
) => {
    /* =====================================================
       VALIDATE CLIENT
    ===================================================== */

    if (!clientId) {
        throw new ApiError(
            401,
            "Client authentication is required."
        );
    }

    /* =====================================================
       PAYMENT MONTH VALIDATION
    ===================================================== */

    if (paymentMonth) {
        const parsedDate =
            new Date(
                `${paymentMonth}T00:00:00`
            );

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            throw new ApiError(
                400,
                "Invalid payment month."
            );
        }
    }

    /* =====================================================
       GET DASHBOARD DATA
    ===================================================== */

    const dashboard =
        await clientPaymentsRepository
            .getClientPaymentDashboard(
                clientId,
                {
                    paymentMonth,
                }
            );

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = {
        totalDue: Number(
            dashboard.summary?.totalDue || 0
        ),

        paidAmount: Number(
            dashboard.summary?.paidAmount || 0
        ),

        totalDuePayments: Number(
            dashboard.summary
                ?.totalDuePayments || 0
        ),

        totalPaidPayments: Number(
            dashboard.summary
                ?.totalPaidPayments || 0
        ),
    };

    /* =====================================================
       PAYMENT HISTORY
    ===================================================== */

    const payments =
        (dashboard.payments || []).map(
            (item) => ({
                uuid: item.uuid,

                paymentMonth:
                    item.payment_month,

                amount: Number(
                    item.amount || 0
                ),

                dueDate:
                    item.due_date,

                status:
                    item.status,

                paidAt:
                    item.paid_at,

                remindersEnabled:
                    Boolean(
                        item.enable_reminders
                    ),
            })
        );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return {
        summary,
        payments,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientPaymentDashboard,
};