"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminPaymentService,
} = require("../../services/index");

const {
    createPaymentSchema,
    updatePaymentSchema,
    updatePaymentRemindersSchema,
} = require("../../validations/admin/payment.validation");

/* =========================================================
   CREATE PAYMENT
========================================================= */

const createPayment = asyncHandler(async (req, res) => {
    const { error, value } =
        createPaymentSchema.validate(req.body, {
            abortEarly: true,
            convert: true,
        });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const payment =
        await adminPaymentService.createPayment(
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Payment created successfully.",
        payment,
        201
    );
});

/* =========================================================
   GET PAYMENTS
========================================================= */

const getPayments = asyncHandler(async (req, res) => {
    const payments =
        await adminPaymentService.getPayments({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,

            search:
                req.query.search || "",

            client_id:
                req.query.client_id || undefined,

            status:
                req.query.status || undefined,

            payment_month:
                req.query.payment_month || undefined,

            due_date:
                req.query.due_date || undefined,
        });

    return ResponseHelper.success(
        res,
        "Payments fetched successfully.",
        payments
    );
});

/* =========================================================
   GET PAYMENT DETAILS
========================================================= */

const getPayment = asyncHandler(async (req, res) => {
    const payment =
        await adminPaymentService.getPayment(
            req.params.uuid
        );

    return ResponseHelper.success(
        res,
        "Payment fetched successfully.",
        payment
    );
});

/* =========================================================
   UPDATE PAYMENT
========================================================= */

const updatePayment = asyncHandler(async (req, res) => {
    const { error, value } =
        updatePaymentSchema.validate(req.body, {
            abortEarly: true,
            convert: true,
        });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const payment =
        await adminPaymentService.updatePayment(
            req.params.uuid,
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Payment updated successfully.",
        payment
    );
});

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

const updatePaymentStatus = asyncHandler(
    async (req, res) => {
        const { status } = req.body;

        const allowedStatus = [
            "due",
            "paid",
            "overdue",
        ];

        if (!status) {
            return ResponseHelper.error(
                res,
                "Status is required.",
                null,
                422
            );
        }

        if (!allowedStatus.includes(status)) {
            return ResponseHelper.error(
                res,
                "Invalid status value.",
                null,
                422
            );
        }

        const payment =
            await adminPaymentService.updatePaymentStatus(
                req.params.uuid,
                status,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Payment status updated successfully.",
            payment
        );
    }
);

/* =========================================================
   DELETE PAYMENT
   Soft Delete
========================================================= */
const deletePayment = asyncHandler(async (req, res) => {
    await adminPaymentService.deletePayment(
        req.params.uuid
    );

    return ResponseHelper.success(
        res,
        "Payment deleted successfully."
    );
});

/* =========================================================
   PAYMENTS BY CLIENT
========================================================= */

const getPaymentsByClient = asyncHandler(
    async (req, res) => {
        const payments =
            await adminPaymentService.getPaymentsByClient(
                req.params.clientId,
                {
                    page:
                        Number(req.query.page) || 1,

                    limit:
                        Number(req.query.limit) || 10,
                }
            );

        return ResponseHelper.success(
            res,
            "Client payments fetched successfully.",
            payments
        );
    }
);


/* =========================================================
   PAYMENT STATS
========================================================= */

const getPaymentStats = asyncHandler(
    async (req, res) => {
        const stats =
            await adminPaymentService.getPaymentStats({
                payment_month:
                    req.query.payment_month ||
                    undefined,
            });

        return ResponseHelper.success(
            res,
            "Payment stats fetched successfully.",
            stats
        );
    }
);

/* =========================================================
   UPDATE PAYMENT REMINDERS
========================================================= */

const updatePaymentReminders =
    asyncHandler(async (req, res) => {
        const { error, value } =
            updatePaymentRemindersSchema.validate(
                req.body,
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

        const payment =
            await adminPaymentService.updatePaymentReminders(
                req.params.uuid,
                value,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Payment reminders updated successfully.",
            payment
        );
    });
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    createPayment,
    getPayments,
    getPayment,
    updatePayment,
    updatePaymentStatus,
    updatePaymentReminders,
    deletePayment,
    getPaymentsByClient,
    getPaymentStats,
};