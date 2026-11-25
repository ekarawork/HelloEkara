"use strict";

const { Op } = require("sequelize");

const {
    payment_reminder_log,
    payment,
    payment_reminder,
    client,
} = require("../../database/models");

/* =========================================================
   PAYMENT / REMINDER FIND
========================================================= */

const findPaymentById = async (
    id,
    options = {}
) => {
    return await payment.findByPk(id, {
        ...options,
    });
};

const findReminderById = async (
    id,
    options = {}
) => {
    return await payment_reminder.findByPk(id, {
        ...options,
    });
};

/* =========================================================
   CREATE LOG
========================================================= */

const createPaymentReminderLog = async (
    payload,
    transaction
) => {
    return await payment_reminder_log.create(
        payload,
        {
            transaction,
        }
    );
};

const createPaymentReminderLogs = async (
    payload,
    transaction
) => {
    return await payment_reminder_log.bulkCreate(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   FIND
========================================================= */

const findById = async (
    id,
    options = {}
) => {
    return await payment_reminder_log.findByPk(
        id,
        {
            include: [
                /* =========================
                   PAYMENT
                ========================= */

                {
                    model: payment,
                    as: "payment",
                    required: true,

                    include: [
                        {
                            model: client,
                            as: "client",
                            required: true,

                            attributes: [
                                "id",
                                "uuid",
                                "name",
                                "email",
                                "login_id",
                            ],
                        },
                    ],
                },

                /* =========================
                   PAYMENT REMINDER
                ========================= */

                {
                    model: payment_reminder,
                    as: "paymentReminder",
                    required: true,
                },
            ],

            ...options,
        }
    );
};

const findByUuid = async (
    uuid,
    options = {}
) => {
    return await payment_reminder_log.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

const findByReminderAndScheduledFor = async (
    paymentReminderId,
    scheduledFor,
    options = {}
) => {
    return await payment_reminder_log.findOne({
        where: {
            payment_reminder_id:
                paymentReminderId,

            scheduled_for:
                scheduledFor,
        },

        ...options,
    });
};

/* =========================================================
   LIST
========================================================= */

const getPaymentReminderLogsList = async ({
    page = 1,
    limit = 10,
    payment_id,
    payment_reminder_id,
    status,
    channel,
    from_date,
    to_date,
} = {}) => {
    page = Math.max(
        Number(page) || 1,
        1
    );

    limit = Math.max(
        Number(limit) || 10,
        1
    );

    const offset =
        (page - 1) * limit;

    const where = {};

    if (payment_id) {
        where.payment_id =
            payment_id;
    }

    if (payment_reminder_id) {
        where.payment_reminder_id =
            payment_reminder_id;
    }

    if (status) {
        where.status = status;
    }

    if (channel) {
        where.channel = channel;
    }

    if (from_date || to_date) {
        where.scheduled_for = {};

        if (from_date) {
            where.scheduled_for[
                Op.gte
            ] = from_date;
        }

        if (to_date) {
            where.scheduled_for[
                Op.lte
            ] = to_date;
        }
    }

    const {
        count,
        rows,
    } = await payment_reminder_log.findAndCountAll({
        where,

        include: [
            {
                model: payment,
                as: "payment",
                required: false,
            },

            {
                model: payment_reminder,
                as: "paymentReminder",
                required: false,
            },
        ],

        offset,
        limit,

        distinct: true,

        order: [
            [
                "scheduled_for",
                "DESC",
            ],
            ["id", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(
                count / limit
            ),
    };
};

/* =========================================================
   LOGS BY PAYMENT
========================================================= */

const getPaymentReminderLogs = async (
    paymentId,
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            payment_id:
                paymentId,
        },

        order: [
            [
                "scheduled_for",
                "DESC",
            ],
            ["id", "DESC"],
        ],

        ...options,
    });
};

/* =========================================================
   LOGS BY REMINDER
========================================================= */

const getReminderLogs = async (
    paymentReminderId,
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            payment_reminder_id:
                paymentReminderId,
        },

        order: [
            [
                "scheduled_for",
                "DESC",
            ],
            ["id", "DESC"],
        ],

        ...options,
    });
};

/* =========================================================
   SCHEDULER
========================================================= */

/**
 * Get all pending reminder logs.
 *
 * Internal scheduler use.
 */
const getPendingReminderLogs = async (
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            status: "pending",
        },

        order: [
            [
                "scheduled_for",
                "ASC",
            ],
            ["id", "ASC"],
        ],

        ...options,
    });
};

/**
 * Get reminder logs which are ready
 * to be processed.
 *
 * scheduled_for <= currentDateTime
 * AND status = pending
 */
const getScheduledReminderLogs = async (
    currentDateTime,
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            status: "pending",

            scheduled_for: {
                [Op.lte]:
                    currentDateTime,
            },
        },

        include: [
            {
                model: payment,
                as: "payment",
                required: true,

                include: [
                    {
                        model: client,
                        as: "client",
                        required: true,
                    },
                ],
            },

            {
                model: payment_reminder,
                as: "paymentReminder",
                required: true,
            },
        ],

        order: [
            [
                "scheduled_for",
                "ASC",
            ],
            ["id", "ASC"],
        ],

        ...options,
    });
};

/* =========================================================
   SENT / FAILED
========================================================= */

const getSentReminderLogs = async (
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            status: "sent",
        },

        order: [
            ["sent_at", "DESC"],
            ["id", "DESC"],
        ],

        ...options,
    });
};

const getFailedReminderLogs = async (
    options = {}
) => {
    return await payment_reminder_log.findAll({
        where: {
            status: "failed",
        },

        order: [
            [
                "scheduled_for",
                "DESC",
            ],
            ["id", "DESC"],
        ],

        ...options,
    });
};

/* =========================================================
   UPDATE
========================================================= */

const updateReminderLog = async (
    logData,
    payload,
    transaction
) => {
    return await logData.update(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   STATUS
========================================================= */

/**
 * Mark reminder log as sent.
 */
const markAsSent = async (
    logData,
    sentAt = new Date(),
    transaction
) => {
    return await logData.update(
        {
            status: "sent",

            sent_at:
                sentAt,

            error_message:
                null,
        },

        {
            transaction,
        }
    );
};

/**
 * Mark reminder log as failed.
 */
const markAsFailed = async (
    logData,
    errorMessage,
    transaction
) => {
    return await logData.update(
        {
            status: "failed",

            error_message:
                errorMessage || null,
        },

        {
            transaction,
        }
    );
};

/* =========================================================
   DETAILS
========================================================= */

const getReminderLogDetails = async (
    uuid,
    options = {}
) => {
    return await payment_reminder_log.findOne({
        where: {
            uuid,
        },

        include: [
            {
                model: payment,
                as: "payment",
                required: false,
            },

            {
                model: payment_reminder,
                as: "paymentReminder",
                required: false,
            },
        ],

        ...options,
    });
};


const createReminderLogIfNotExists = async (
    reminder,
    scheduledFor,
    transaction
) => {
    const existingLog =
        await findByReminderAndScheduledFor(
            reminder.id,
            scheduledFor,
            {
                transaction,
            }
        );

    if (existingLog) {
        return existingLog;
    }

    return await createPaymentReminderLog(
        {
            payment_id:
                reminder.payment_id,

            payment_reminder_id:
                reminder.id,

            scheduled_for:
                scheduledFor,

            sent_at: null,

            status: "pending",

            channel:
                reminder.channel || "email",

            message:
                reminder.message || null,

            error_message: null,
        },
        transaction
    );
};
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    // Payment / Reminder
    findPaymentById,
    findReminderById,

    // Create
    createPaymentReminderLog,
    createPaymentReminderLogs,

    // Find
    findById,
    findByUuid,
    findByReminderAndScheduledFor,

    // List
    getPaymentReminderLogsList,

    // By Payment / Reminder
    getPaymentReminderLogs,
    getReminderLogs,

    // Scheduler
    getPendingReminderLogs,
    getScheduledReminderLogs,

    // Sent / Failed
    getSentReminderLogs,
    getFailedReminderLogs,

    // Update
    updateReminderLog,

    // Status
    markAsSent,
    markAsFailed,

    // Details
    getReminderLogDetails,
    createReminderLogIfNotExists
};