"use strict";

const { Op } = require("sequelize");

const {
    payment,
    client,
    user,
    payment_reminder,
} = require("../../database/models");

/* =========================================================
   CLIENT
========================================================= */

// Find client by ID
const findClientById = async (
    clientId,
    options = {}
) => {
    return await client.findByPk(
        clientId,
        {
            ...options,
        }
    );
};

/* =========================================================
   PAYMENT
========================================================= */

// Create payment
const createPayment = async (
    payload,
    transaction
) => {
    return await payment.create(
        payload,
        {
            transaction,
        }
    );
};

// Find payment by ID
const findById = async (
    id,
    options = {}
) => {
    return await payment.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find payment by UUID
const findByUuid = async (
    uuid,
    options = {}
) => {
    return await payment.findOne({
        where: {
            uuid,
        },

        ...options,
    });
};

/* =========================================================
   DUPLICATE PAYMENT CHECK
========================================================= */

// Find payment by client + payment month
const findByClientAndMonth = async (
    clientId,
    paymentMonth,
    options = {}
) => {
    return await payment.findOne({
        where: {
            client_id: clientId,
            payment_month: paymentMonth,
        },

        ...options,
    });
};

/* =========================================================
   UPDATE PAYMENT
========================================================= */

const updatePayment = async (
    paymentData,
    payload,
    transaction
) => {
    return await paymentData.update(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

const updatePaymentStatus = async (
    paymentData,
    status,
    userId,
    transaction
) => {
    const payload = {
        status,
        updated_by: userId,
    };

    // Payment marked as paid
    if (status === "paid") {
        payload.paid_at = new Date();
    } else {
        // Due / overdue
        payload.paid_at = null;
    }

    return await paymentData.update(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   PAYMENT DELETE
========================================================= */

// Soft delete payment
const deletePayment = async (
    paymentData,
    transaction
) => {
    await paymentData.destroy({
        transaction,
        force: true,
    });

    return true;
};

/* =========================================================
   PAYMENT LIST
========================================================= */

const getPayments = async ({
    page = 1,
    limit = 10,
    search = "",
    client_name,
    client_id,
    status,
    payment_month,
    due_date,
}) => {
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const offset = (page - 1) * limit;

    const where = {};

    /* =========================================================
       CLIENT NAME FILTER
    ========================================================= */

    if (client_name) {
        where["$client.name$"] = {
            [Op.like]: `%${client_name}%`,
        };
    }

    /* =========================================================
       SEARCH
       Search client name OR email
    ========================================================= */

    if (search) {
        where[Op.or] = [
            {
                "$client.name$": {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                "$client.email$": {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    /* =========================================================
       CLIENT FILTER
    ========================================================= */

    if (client_id) {
        where.client_id = client_id;
    }

    /* =========================================================
       STATUS FILTER
    ========================================================= */

    if (status) {
        where.status = status;
    }

    /* =========================================================
       PAYMENT MONTH FILTER
    ========================================================= */

    if (payment_month) {
        where.payment_month = payment_month;
    }

    /* =========================================================
       DUE DATE FILTER
    ========================================================= */

    if (due_date) {
        where.due_date = due_date;
    }

    /* =========================================================
       QUERY
    ========================================================= */

    const {
        count,
        rows,
    } = await payment.findAndCountAll({
        where,

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

        offset,
        limit,

        distinct: true,

        order: [
            ["payment_month", "DESC"],
            ["id", "DESC"],
        ],
    });

        return {
            count,
            rows,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
};

/* =========================================================
   PAYMENT DETAILS
========================================================= */

const getPaymentDetails = async (
    uuid,
    options = {}
) => {
    return await payment.findOne({
        where: {
            uuid,
        },

        include: [
            /* -------------------------
               Client
            ------------------------- */

            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "email",
                    "login_id",
                ],
            },

            /* -------------------------
               Reminders
            ------------------------- */

            {
                model: payment_reminder,
                as: "reminders",
                required: false,
                separate: true,
                order: [
                    ["reminder_type", "ASC"],
                    ["id", "ASC"],
                ],
            },

            /* -------------------------
               Creator
            ------------------------- */

            {
                model: user,
                as: "creator",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
            },

            /* -------------------------
               Updater
            ------------------------- */

            {
                model: user,
                as: "updater",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "first_name",
                    "last_name",
                    "email",
                ],
            },
        ],

        ...options,
    });
};

/* =========================================================
   CLIENT PAYMENTS
========================================================= */

const getPaymentsByClient = async (
    clientId,
    options = {}
) => {
    return await payment.findAll({
        where: {
            client_id: clientId,
        },

        order: [
            ["payment_month", "DESC"],
            ["id", "DESC"],
        ],

        ...options,
    });
};

/* =========================================================
   PAYMENT STATUS / SCHEDULER
========================================================= */

// Get overdue payments
const getOverduePayments = async (
    options = {}
) => {
    return await payment.findAll({
        where: {
            status: "overdue",
        },

        order: [
            ["due_date", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

// Get due payments
const getDuePayments = async (
    options = {}
) => {
    return await payment.findAll({
        where: {
            status: "due",
        },

        order: [
            ["due_date", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

// Get payments where reminders are enabled
const getReminderPayments = async (
    options = {}
) => {
    return await payment.findAll({
        where: {
            enable_reminders: true,

            status: {
                [Op.in]: [
                    "due",
                    "overdue",
                ],
            },
        },

        order: [
            ["due_date", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

const enablePaymentReminders = async (
    paymentData,
    userId,
    transaction
) => {
    return await paymentData.update(
        {
            enable_reminders: true,
            updated_by: userId,
        },
        {
            transaction,
        }
    );
};


const disablePaymentReminders = async (
    paymentData,
    userId,
    transaction
) => {
    return await paymentData.update(
        {
            enable_reminders: false,
            updated_by: userId,
        },
        {
            transaction,
        }
    );
};

/* =========================================================
   PAYMENT DASHBOARD STATS
========================================================= */

/* =========================================================
   PAYMENT DASHBOARD STATS
========================================================= */

const getPaymentStats = async ({
    payment_month,
} = {}) => {
    const where = {};

    if (payment_month) {
        where.payment_month = payment_month;
    }

    const [
        totalDue,
        paidAmount,
        totalDuePayments,
        totalPaidPayments,
    ] = await Promise.all([
        /* =====================================================
           TOTAL DUE AMOUNT

           Includes:
           - due
           - overdue
        ===================================================== */

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

        /* =====================================================
           TOTAL PAID AMOUNT
        ===================================================== */

        payment.sum("amount", {
            where: {
                ...where,

                status: "paid",
            },
        }),

        /* =====================================================
           TOTAL DUE PAYMENTS

           Includes:
           - due
           - overdue
        ===================================================== */

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

        /* =====================================================
           TOTAL PAID PAYMENTS
        ===================================================== */

        payment.count({
            where: {
                ...where,

                status: "paid",
            },
        }),
    ]);

    return {
        totalDue: Number(
            totalDue || 0
        ),

        paidAmount: Number(
            paidAmount || 0
        ),

        totalDuePayments: Number(
            totalDuePayments || 0
        ),

        totalPaidPayments: Number(
            totalPaidPayments || 0
        ),
    };
};
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    // Client
    findClientById,

    // Payment
    createPayment,
    findById,
    findByUuid,
    findByClientAndMonth,
    updatePayment,
    updatePaymentStatus,
    deletePayment,

    // List
    getPayments,

    // Details
    getPaymentDetails,

    // Stats
    getPaymentStats,

    // Client payments
    getPaymentsByClient,

    // Status / Scheduler
    getOverduePayments,
    getDuePayments,
    getReminderPayments,

    enablePaymentReminders,
    disablePaymentReminders,
};