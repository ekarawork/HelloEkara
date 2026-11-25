"use strict";

const {
    adminPaymentRepository,
    adminPaymentReminderRepository,
} = require("../../repositories/index");

const {
    generatePaymentReminderLog,
} = require("./paymentReminderLog.service");
const {
    sequelize,
} = require("../../database/models");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");


/* =========================================================
   CREATE PAYMENT
========================================================= */

const createPayment = async (
    payload,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* =========================
           Check Client
        ========================= */

        const client =
            await adminPaymentRepository.findClientById(
                payload.client_id,
                {
                    transaction,
                }
            );

        if (!client) {
            throw new ApiError(
                404,
                "Client not found."
            );
        }

        /* =========================
           Duplicate Payment
        ========================= */

        const existingPayment =
            await adminPaymentRepository.findByClientAndMonth(
                payload.client_id,
                payload.payment_month,
                {
                    transaction,
                }
            );

        if (existingPayment) {
            throw new ApiError(
                409,
                "Payment for this client and month already exists."
            );
        }

        /* =========================
           Create Payment
        ========================= */

        const payment =
            await adminPaymentRepository.createPayment(
                {
                    client_id: payload.client_id,
                    payment_month: payload.payment_month,
                    amount: payload.amount,
                    due_date: payload.due_date,
                    status: payload.status || "due",
                    paid_at:
                        payload.status === "paid"
                            ? new Date()
                            : null,
                    enable_reminders:
                        payload.enable_reminders || false,
                    created_by: userId,
                    updated_by: userId,
                },
                transaction
            );

        /* =========================
           Create Reminders
        ========================= */

        if (
            payload.enable_reminders === true &&
            Array.isArray(payload.reminders) &&
            payload.reminders.length > 0
        ) {
            const reminders =
                await adminPaymentReminderRepository.createReminders(
                    payment.id,
                    payload.reminders,
                    userId,
                    transaction
                );

            for (const reminder of reminders) {
                await generatePaymentReminderLog(
                    reminder,
                    payment,
                    transaction
                );
            }
        }

        await transaction.commit();

        return await adminPaymentRepository.getPaymentDetails(
            payment.uuid
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};


/* =========================================================
   GET PAYMENTS
========================================================= */

const getPayments = async (
    query = {}
) => {
    return await adminPaymentRepository.getPayments(
        query
    );
};


/* =========================================================
   GET PAYMENT DETAILS
========================================================= */

const getPayment = async (
    uuid
) => {
    const payment =
        await adminPaymentRepository.getPaymentDetails(
            uuid
        );

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found."
        );
    }

    return payment;
};


/* =========================================================
   UPDATE PAYMENT
========================================================= */

const updatePayment = async (
    uuid,
    payload,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* =========================
           Find Payment
        ========================= */

        const payment =
            await adminPaymentRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found."
            );
        }

        /* =========================
           Check Client
        ========================= */

        if (
            payload.client_id !== undefined &&
            payload.client_id !== payment.client_id
        ) {
            const client =
                await adminPaymentRepository.findClientById(
                    payload.client_id,
                    {
                        transaction,
                    }
                );

            if (!client) {
                throw new ApiError(
                    404,
                    "Client not found."
                );
            }
        }

        /* =========================
           Duplicate Payment
        ========================= */

        if (
            payload.client_id !== undefined ||
            payload.payment_month !== undefined
        ) {
            const clientId =
                payload.client_id !== undefined
                    ? payload.client_id
                    : payment.client_id;

            const paymentMonth =
                payload.payment_month !== undefined
                    ? payload.payment_month
                    : payment.payment_month;

            const existingPayment =
                await adminPaymentRepository.findByClientAndMonth(
                    clientId,
                    paymentMonth,
                    {
                        transaction,
                    }
                );

            if (
                existingPayment &&
                existingPayment.id !== payment.id
            ) {
                throw new ApiError(
                    409,
                    "Payment for this client and month already exists."
                );
            }
        }

        /* =========================
           Payment Update
        ========================= */

        const paymentPayload = {
            ...(payload.client_id !== undefined && {
                client_id: payload.client_id,
            }),

            ...(payload.payment_month !== undefined && {
                payment_month: payload.payment_month,
            }),

            ...(payload.amount !== undefined && {
                amount: payload.amount,
            }),

            ...(payload.due_date !== undefined && {
                due_date: payload.due_date,
            }),

            ...(payload.status !== undefined && {
                status: payload.status,
            }),

            ...(payload.paid_at !== undefined && {
                paid_at: payload.paid_at,
            }),

            ...(payload.enable_reminders !== undefined && {
                enable_reminders:
                    payload.enable_reminders,
            }),

            updated_by: userId,
        };

        /*
         * If status changes to paid,
         * automatically set paid_at.
         */
        if (payload.status === "paid") {
            paymentPayload.paid_at =
                payload.paid_at || new Date();
        }

        /*
         * If status changes back to due/overdue,
         * clear paid_at.
         */
        if (
            payload.status &&
            payload.status !== "paid"
        ) {
            paymentPayload.paid_at = null;
        }

        await adminPaymentRepository.updatePayment(
            payment,
            paymentPayload,
            transaction
        );

        /* =========================
           Reminder Update
        ========================= */

        if (
            payload.enable_reminders !== undefined ||
            payload.reminders !== undefined
        ) {
            const remindersEnabled =
                payload.enable_reminders !== undefined
                    ? payload.enable_reminders
                    : payment.enable_reminders;

            await adminPaymentReminderRepository.syncReminders(
                payment.id,
                remindersEnabled,
                payload.reminders,
                userId,
                transaction
            );
        }

        await transaction.commit();

        return await adminPaymentRepository.getPaymentDetails(
            uuid
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};


/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

const updatePaymentStatus = async (
    uuid,
    status,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* =========================
           Find Payment
        ========================= */

        const payment =
            await adminPaymentRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found."
            );
        }

        /* =========================
           Already Paid
        ========================= */

        if (
            status === "paid" &&
            payment.status === "paid"
        ) {
            throw new ApiError(
                400,
                "Payment is already marked as paid."
            );
        }

        /* =========================
           Update Status
        ========================= */

        await adminPaymentRepository.updatePaymentStatus(
            payment,
            status,
            userId,
            transaction
        );

        await transaction.commit();

        return await adminPaymentRepository.getPaymentDetails(
            uuid
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};


/* =========================================================
   DELETE PAYMENT
========================================================= */

const deletePayment = async (
    uuid
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /* =========================
           Find Payment
        ========================= */

        const payment =
            await adminPaymentRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found."
            );
        }

        /* =========================
           HARD DELETE
        ========================= */

        await adminPaymentRepository.deletePayment(
            payment,
            transaction
        );

        await transaction.commit();

        return true;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};


/* =========================================================
   PAYMENTS BY CLIENT
========================================================= */

const getPaymentsByClient = async (
    clientId,
    query = {}
) => {
    return await adminPaymentRepository.getPaymentsByClient(
        clientId,
        query
    );
};

/* =========================================================
   UPDATE PAYMENT REMINDERS
========================================================= */

const updatePaymentReminders = async (
    uuid,
    payload,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const payment =
            await adminPaymentRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found."
            );
        }

        const remindersEnabled =
            payload.enabled !== undefined
                ? payload.enabled
                : payment.enable_reminders;

        /* =====================================================
           UPDATE PAYMENT MASTER REMINDER STATUS
        ===================================================== */

        await adminPaymentRepository.updatePayment(
            payment,
            {
                enable_reminders:
                    remindersEnabled,

                updated_by: userId,
            },
            transaction
        );

        /* =====================================================
           SYNC REMINDERS
        ===================================================== */

        await adminPaymentReminderRepository.syncReminders(
            payment.id,
            remindersEnabled,
            payload.reminders,
            userId,
            transaction
        );

        await transaction.commit();

        return await adminPaymentRepository.getPaymentDetails(
            uuid
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* =========================================================
   PAYMENT DASHBOARD STATS
========================================================= */

const getPaymentStats = async (
    query = {}
) => {
    return await adminPaymentRepository.getPaymentStats(
        query
    );
};
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