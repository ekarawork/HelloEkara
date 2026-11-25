"use strict";

const { Op } = require("sequelize");

const {
    notification,
    user,
} = require("../../database/models");

/* =========================================================
   CREATE
========================================================= */

const createNotification = async (
    payload,
    transaction
) => {
    return await notification.create(
        payload,
        {
            transaction,
        }
    );
};

const createNotifications = async (
    payload,
    transaction
) => {
    return await notification.bulkCreate(
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
    return await notification.findByPk(
        id,
        {
            ...options,
        }
    );
};

const findByUuid = async (
    uuid,
    options = {}
) => {
    return await notification.findOne({
        where: {
            uuid,
        },
        ...options,
    });
};

/* =========================================================
   NOTIFICATION LIST
========================================================= */

const getNotificationsList = async ({
    page = 1,
    limit = 10,
    user_id,
    type,
    is_read,
    reference_type,
    reference_id,
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

    if (user_id) {
        where.user_id = user_id;
    }

    if (type) {
        where.type = type;
    }

    if (
        is_read !== undefined &&
        is_read !== null &&
        is_read !== ""
    ) {
        where.is_read =
            is_read === true ||
            is_read === "true" ||
            is_read === 1 ||
            is_read === "1";
    }

    if (reference_type) {
        where.reference_type =
            reference_type;
    }

    if (reference_id) {
        where.reference_id =
            reference_id;
    }

    if (from_date || to_date) {
        where.createdAt = {};

        if (from_date) {
            where.createdAt[Op.gte] =
                from_date;
        }

        if (to_date) {
            where.createdAt[Op.lte] =
                to_date;
        }
    }

    const {
        count,
        rows,
    } = await notification.findAndCountAll({
        where,

        include: [
            {
                model: user,
                as: "user",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                    "email",
                ],
            },
        ],

        offset,
        limit,

        distinct: true,

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages: Math.ceil(
            count / limit
        ),
    };
};

/* =========================================================
   USER NOTIFICATIONS
========================================================= */

const getUserNotifications = async (
    userId,
    {
        page = 1,
        limit = 10,
        is_read,
        type,
    } = {}
) => {
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

    const where = {
        user_id: userId,
    };

    if (
        is_read !== undefined &&
        is_read !== null &&
        is_read !== ""
    ) {
        where.is_read =
            is_read === true ||
            is_read === "true" ||
            is_read === 1 ||
            is_read === "1";
    }

    if (type) {
        where.type = type;
    }

    const {
        count,
        rows,
    } = await notification.findAndCountAll({
        where,

        offset,
        limit,

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages: Math.ceil(
            count / limit
        ),
    };
};

/* =========================================================
   UNREAD
========================================================= */

const getUnreadNotifications = async (
    userId,
    options = {}
) => {
    return await notification.findAll({
        where: {
            user_id: userId,
            is_read: false,
        },

        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],

        ...options,
    });
};

const getUnreadNotificationCount =
    async (
        userId
    ) => {
        return await notification.count({
            where: {
                user_id: userId,
                is_read: false,
            },
        });
    };

/* =========================================================
   UPDATE
========================================================= */

const updateNotification = async (
    notificationData,
    payload,
    transaction
) => {
    return await notificationData.update(
        payload,
        {
            transaction,
        }
    );
};

/* =========================================================
   MARK AS READ
========================================================= */

const markAsRead = async (
    notificationData,
    readAt,
    transaction
) => {
    return await notificationData.update(
        {
            is_read: true,
            read_at:
                readAt || new Date(),
        },
        {
            transaction,
        }
    );
};

/* =========================================================
   MARK AS UNREAD
========================================================= */

const markAsUnread = async (
    notificationData,
    transaction
) => {
    return await notificationData.update(
        {
            is_read: false,
            read_at: null,
        },
        {
            transaction,
        }
    );
};

/* =========================================================
   MARK ALL AS READ
========================================================= */

const markAllAsRead = async (
    userId,
    readAt,
    transaction
) => {
    return await notification.update(
        {
            is_read: true,
            read_at:
                readAt || new Date(),
        },
        {
            where: {
                user_id: userId,
                is_read: false,
            },

            transaction,
        }
    );
};

/* =========================================================
   DELETE
========================================================= */

const deleteNotification = async (
    notificationData,
    transaction
) => {
    return await notificationData.destroy({
        transaction,
    });
};

/* =========================================================
   DELETE USER NOTIFICATIONS
========================================================= */

const deleteUserNotifications = async (
    userId,
    transaction
) => {
    return await notification.destroy({
        where: {
            user_id: userId,
        },

        transaction,
    });
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    // Create
    createNotification,
    createNotifications,

    // Find
    findById,
    findByUuid,

    // List
    getNotificationsList,
    getUserNotifications,

    // Unread
    getUnreadNotifications,
    getUnreadNotificationCount,

    // Update
    updateNotification,

    // Read status
    markAsRead,
    markAsUnread,
    markAllAsRead,

    // Delete
    deleteNotification,
    deleteUserNotifications,
};