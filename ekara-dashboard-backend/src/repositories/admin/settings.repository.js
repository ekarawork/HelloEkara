"use strict";

const { user, agency_setting } = require("../../database/models");

/* =========================================================
   GET ADMIN PROFILE
========================================================= */

const getAdminProfile = async (userId) => {
    return await user.findOne({
        where: {
            id: userId,
        },

        attributes: [
            "id",
            "uuid",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
        ],
    });
};

/* =========================================================
   FIND USER BY EMAIL
   Used for email uniqueness check
========================================================= */

const findUserByEmail = async (email, excludeUserId = null) => {
    const where = {
        email,
    };

    if (excludeUserId) {
        where.id = {
            [require("sequelize").Op.ne]: excludeUserId,
        };
    }

    return await user.findOne({
        where,
        attributes: [
            "id",
            "uuid",
            "email",
            "role",
            "status",
        ],
    });
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

const updateAdminProfile = async (userId, data) => {
    await user.update(
        data,
        {
            where: {
                id: userId,
            },
        }
    );

    return await getAdminProfile(userId);
};


/* =========================================================
   GET USER WITH PASSWORD
========================================================= */

const getUserWithPassword = async (userId) => {
    return await user.findOne({
        where: {
            id: userId,
        },
        attributes: [
            "id",
            "uuid",
            "password",
            "status",
        ],
    });
};

/* =========================================================
   UPDATE PASSWORD
========================================================= */

const updateAdminPassword = async (
    userId,
    hashedPassword
) => {
    return await user.update(
        {
            password: hashedPassword,
        },
        {
            where: {
                id: userId,
            },
        }
    );
};

/* =========================================================
   GET PAYMENT REMINDER SETTINGS
   Global/default settings for new payments
========================================================= */

const getPaymentReminderSettings = async () => {
    let settings = await agency_setting.findOne({
        order: [
            ["id", "ASC"],
        ],
    });

    /*
     * If settings row does not exist,
     * create the default settings.
     */
    if (!settings) {
        settings = await agency_setting.create({
            before_due_enabled: true,
            before_due_days: 3,

            due_day_enabled: true,

            after_due_enabled: true,
            after_due_days: 1,
        });
    }

    return settings;
};

/* =========================================================
   UPDATE PAYMENT REMINDER SETTINGS
========================================================= */

const updatePaymentReminderSettings = async (
    data,
    userId
) => {
    let settings = await agency_setting.findOne({
        order: [
            ["id", "ASC"],
        ],
    });

    /*
     * First time settings are being saved.
     * Create the single global settings row.
     */
    if (!settings) {
        settings = await agency_setting.create({
            ...data,
            created_by: userId,
            updated_by: userId,
        });

        return settings;
    }

    /*
     * Existing settings row.
     * Update only the provided values.
     */
    await settings.update({
        ...data,
        updated_by: userId,
    });

    return settings;
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getAdminProfile,
    findUserByEmail,
    updateAdminProfile,
    getUserWithPassword,
    updateAdminPassword,

    getPaymentReminderSettings,
    updatePaymentReminderSettings,
};