"use strict";

const { Op } = require("sequelize");

const {
    user,
} = require("../../database/models");

/* =========================================================
   GET EMPLOYEE PROFILE
========================================================= */

const getEmployeeProfile = async (userId) => {
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
   UPDATE EMPLOYEE PROFILE
========================================================= */

const updateEmployeeProfile = async (
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

    return await getEmployeeProfile(userId);
};

/* =========================================================
   GET EMPLOYEE USER WITH PASSWORD
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
   UPDATE EMPLOYEE PASSWORD
========================================================= */

const updateEmployeePassword = async (
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
    getEmployeeProfile,
    findUserByEmail,
    updateEmployeeProfile,
    getUserWithPassword,
    updateEmployeePassword,
};