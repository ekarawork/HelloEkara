"use strict";

const { Op } = require("sequelize");

const {
    user,
} = require("../../database/models");

/* =========================================================
   GET CLIENT PROFILE
========================================================= */

const getClientProfile = async (userId) => {
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

const findUserByEmail = async (
    email,
    excludeUserId = null
) => {
    const where = {
        email,
    };

    if (excludeUserId) {
        where.id = {
            [Op.ne]: excludeUserId,
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
   UPDATE CLIENT PROFILE
========================================================= */

const updateClientProfile = async (
    userId,
    data
) => {
    await user.update(
        data,
        {
            where: {
                id: userId,
            },
        }
    );

    return await getClientProfile(userId);
};

/* =========================================================
   GET CLIENT USER WITH PASSWORD
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
            "role",
            "status",
        ],
    });
};

/* =========================================================
   UPDATE CLIENT PASSWORD
========================================================= */

const updateClientPassword = async (
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
   EXPORTS
========================================================= */

module.exports = {
    getClientProfile,
    findUserByEmail,
    updateClientProfile,
    getUserWithPassword,
    updateClientPassword,
};