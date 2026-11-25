"use strict";

const {
    Op,
} = require("sequelize");

const {
    payment,
} = require("../../database/models");

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

    const where = {
        client_id: clientId,
    };

    /* =====================================================
       PAYMENT MONTH FILTER
    ===================================================== */

    if (paymentMonth) {
        where.payment_month = paymentMonth;
    }

    /* =====================================================
       DASHBOARD SUMMARY
    ===================================================== */

    const [
        totalDue,
        paidAmount,
        totalDuePayments,
        totalPaidPayments,
    ] = await Promise.all([
        /* =================================================
           TOTAL DUE AMOUNT

           Includes:
           - due
           - overdue
        ================================================= */

        payment.sum("amount", {
            where: {
                ...where,

                status: {
                    [Op.in]: [
                        "due",
                        "overdue",
                    ],
                },
            },
        }),

        /* =================================================
           TOTAL PAID AMOUNT
        ================================================= */

        payment.sum("amount", {
            where: {
                ...where,

                status: "paid",
            },
        }),

        /* =================================================
           TOTAL DUE PAYMENTS
        ================================================= */

        payment.count({
            where: {
                ...where,

                status: {
                    [Op.in]: [
                        "due",
                        "overdue",
                    ],
                },
            },
        }),

        /* =================================================
           TOTAL PAID PAYMENTS
        ================================================= */

        payment.count({
            where: {
                ...where,

                status: "paid",
            },
        }),
    ]);

    /* =====================================================
       PAYMENT HISTORY
    ===================================================== */

    const payments =
        await payment.findAll({
            where,

            attributes: [
                "id",
                "uuid",
                "payment_month",
                "amount",
                "due_date",
                "status",
                "paid_at",
                "enable_reminders",
                "createdAt",
                "updatedAt",
            ],

            order: [
                [
                    "payment_month",
                    "DESC",
                ],

                [
                    "id",
                    "DESC",
                ],
            ],

            limit: 100,
        });

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        summary: {
            totalDue:
                Number(totalDue || 0),

            paidAmount:
                Number(paidAmount || 0),

            totalDuePayments:
                Number(
                    totalDuePayments || 0
                ),

            totalPaidPayments:
                Number(
                    totalPaidPayments || 0
                ),
        },

        payments,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientPaymentDashboard,
};