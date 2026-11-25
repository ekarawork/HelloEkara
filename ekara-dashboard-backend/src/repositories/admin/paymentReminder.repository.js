"use strict";

const {
    payment_reminder,
    payment,
    user,
} = require("../../database/models");

/* =========================================================
   CREATE SINGLE REMINDER
========================================================= */

const createPaymentReminder = async (
    payload,
    transaction
) => {
    return await payment_reminder.create(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   CREATE MULTIPLE REMINDERS
========================================================= */

const createReminders = async (
    paymentId,
    reminders,
    userId,
    transaction
) => {
    if (
        !Array.isArray(reminders) ||
        reminders.length === 0
    ) {
        return [];
    }

    const reminderPayloads =
        reminders.map((reminder) => ({
            payment_id: paymentId,

            reminder_type:
                reminder.reminder_type,

            enabled:
                reminder.enabled !== undefined
                    ? reminder.enabled
                    : true,

            days_offset:
                reminder.days_offset !== undefined
                    ? reminder.days_offset
                    : null,

            message:
                reminder.message,

            created_by: userId,
            updated_by: userId,
        }));

    return await payment_reminder.bulkCreate(
        reminderPayloads,
        {
            transaction,
        }
    );
};

/* =========================================================
   FIND REMINDER
========================================================= */

// Find by ID
const findById = async (
    id,
    options = {}
) => {
    return await payment_reminder.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find by UUID
const findByUuid = async (
    uuid,
    options = {}
) => {
    return await payment_reminder.findOne({
        where: {
            uuid,
        },

        ...options,
    });
};

// Find by payment + reminder type
const findByPaymentAndType = async (
    paymentId,
    reminderType,
    options = {}
) => {
    return await payment_reminder.findOne({
        where: {
            payment_id: paymentId,
            reminder_type: reminderType,
        },

        ...options,
    });
};

/* =========================================================
   UPDATE REMINDER
========================================================= */

const updatePaymentReminder = async (
    reminderData,
    payload,
    transaction
) => {
    return await reminderData.update(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   SYNC REMINDERS
========================================================= */

const syncReminders = async (
    paymentId,
    remindersEnabled,
    reminders,
    userId,
    transaction
) => {
    /*
     * Get existing reminders.
     */
    const existingReminders =
        await payment_reminder.findAll({
            where: {
                payment_id: paymentId,
            },

            transaction,
        });

    /*
     * If reminders are disabled,
     * disable all existing reminders.
     */
    if (!remindersEnabled) {
        await payment_reminder.update(
            {
                enabled: false,
                updated_by: userId,
            },
            {
                where: {
                    payment_id: paymentId,
                },
                transaction,
            }
        );

        return [];
    }

    /*
     * If reminders are enabled but
     * no reminder configuration supplied,
     * keep existing reminders as-is.
     */
    if (
        !Array.isArray(reminders) ||
        reminders.length === 0
    ) {
        await payment_reminder.update(
            {
                enabled: true,
                updated_by: userId,
            },
            {
                where: {
                    payment_id: paymentId,
                },

                transaction,
            }
        );

        return existingReminders;
    }

    /*
     * Process each reminder configuration.
     */
    for (const reminder of reminders) {
        const existingReminder =
            existingReminders.find(
                (item) =>
                    item.reminder_type ===
                    reminder.reminder_type
            );

        const reminderPayload = {
            enabled:
                reminder.enabled !== undefined
                    ? reminder.enabled
                    : true,

            days_offset:
                reminder.days_offset !== undefined
                    ? reminder.days_offset
                    : null,

            message:
                reminder.message,

            updated_by: userId,
        };

        /*
         * Update existing reminder.
         */
        if (existingReminder) {
            await existingReminder.update(
                reminderPayload,
                {
                    transaction,
                }
            );

            continue;
        }

        /*
         * Create new reminder.
         */
        await payment_reminder.create(
            {
                payment_id: paymentId,

                reminder_type:
                    reminder.reminder_type,

                enabled:
                    reminder.enabled !== undefined
                        ? reminder.enabled
                        : true,

                days_offset:
                    reminder.days_offset !== undefined
                        ? reminder.days_offset
                        : null,

                message:
                    reminder.message,

                created_by: userId,
                updated_by: userId,
            },
            {
                transaction,
            }
        );
    }

    /*
     * Disable old reminder types that were
     * not included in the new configuration.
     */
    const incomingTypes =
        reminders.map(
            (reminder) =>
                reminder.reminder_type
        );

    for (const existingReminder of existingReminders) {
        if (
            !incomingTypes.includes(
                existingReminder.reminder_type
            )
        ) {
            await existingReminder.update(
                {
                    enabled: false,
                    updated_by: userId,
                },
                {
                    transaction,
                }
            );
        }
    }

    /*
     * Return final reminder state.
     */
    return await payment_reminder.findAll({
        where: {
            payment_id: paymentId,
        },

        order: [
            ["reminder_type", "ASC"],
            ["id", "ASC"],
        ],

        transaction,
    });
};

/* =========================================================
   ENABLE / DISABLE REMINDER
========================================================= */

const updatePaymentReminderStatus = async (
    reminderData,
    enabled,
    userId,
    transaction
) => {
    return await reminderData.update(
        {
            enabled,
            updated_by: userId,
        },
        {
            transaction,
        }
    );
};

/* =========================================================
   REMINDER LIST
========================================================= */

const getPaymentRemindersList = async ({
    page = 1,
    limit = 10,
    payment_id,
    reminder_type,
    enabled,
}) => {
    const offset =
        (page - 1) * limit;

    const where = {};

    if (payment_id) {
        where.payment_id = payment_id;
    }

    if (reminder_type) {
        where.reminder_type =
            reminder_type;
    }

    if (
        enabled !== undefined &&
        enabled !== null
    ) {
        where.enabled = enabled;
    }

    const {
        count,
        rows,
    } = await payment_reminder.findAndCountAll({
        where,

        include: [
            {
                model: payment,
                as: "payment",
                required: false,
            },
        ],

        offset,
        limit,

        distinct: true,

        order: [
            ["payment_id", "ASC"],
            ["reminder_type", "ASC"],
            ["id", "ASC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(count / limit),
    };
};

/* =========================================================
   REMINDERS BY PAYMENT
========================================================= */

// All reminders
const getPaymentReminders = async (
    paymentId,
    options = {}
) => {
    return await payment_reminder.findAll({
        where: {
            payment_id: paymentId,
        },

        order: [
            ["reminder_type", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

// Enabled reminders
const getEnabledPaymentReminders = async (
    paymentId,
    options = {}
) => {
    return await payment_reminder.findAll({
        where: {
            payment_id: paymentId,
            enabled: true,
        },

        order: [
            ["reminder_type", "ASC"],
            ["id", "ASC"],
        ],

        ...options,
    });
};

// All enabled reminders
const getEnabledReminders = async (
    options = {}
) => {
    return await payment_reminder.findAll({
        where: {
            enabled: true,
        },

        order: [
            ["payment_id", "ASC"],
            ["reminder_type", "ASC"],
        ],

        ...options,
    });
};

/* =========================================================
   REMINDER DETAILS
========================================================= */

const getPaymentReminderDetails = async (
    uuid,
    options = {}
) => {
    return await payment_reminder.findOne({
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

const enableRemindersByPayment = async (
    paymentId,
    userId,
    transaction
) => {
    await payment_reminder.update(
        {
            enabled: true,
            updated_by: userId,
        },
        {
            where: {
                payment_id: paymentId,
            },
            transaction,
        }
    );

    return true;
};


const disableRemindersByPayment = async (
    paymentId,
    userId,
    transaction
) => {
    await payment_reminder.update(
        {
            enabled: false,
            updated_by: userId,
        },
        {
            where: {
                payment_id: paymentId,
            },
            transaction,
        }
    );

    return true;
};


/* =========================================================
   UPDATE REMINDER CONFIGURATION
========================================================= */

const updateReminder = async (
    reminderData,
    payload,
    userId,
    transaction
) => {
    return await reminderData.update(
        {
            ...(payload.enabled !== undefined && {
                enabled: payload.enabled,
            }),

            ...(payload.days_offset !== undefined && {
                days_offset: payload.days_offset,
            }),

            ...(payload.message !== undefined && {
                message: payload.message,
            }),

            updated_by: userId,
        },
        {
            transaction,
        }
    );
};
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    createPaymentReminder,
    createReminders,

    findById,
    findByUuid,
    findByPaymentAndType,

    updatePaymentReminder,
    updateReminder,
    updatePaymentReminderStatus,

    syncReminders,

    getPaymentRemindersList,

    getPaymentReminders,
    getEnabledPaymentReminders,
    getEnabledReminders,

    getPaymentReminderDetails,

    enableRemindersByPayment,
    disableRemindersByPayment,
};