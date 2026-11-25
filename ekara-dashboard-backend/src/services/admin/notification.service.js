"use strict";

const {
    adminNotificationRepository,
} = require("../../repositories/index");

const {
    sequelize,
} = require("../../database/models");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   CREATE NOTIFICATION
   Internal Module Use
========================================================= */

const createNotification = async (
    payload
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const notification =
            await adminNotificationRepository.createNotification(
                {
                    user_id:
                        payload.user_id,

                    title:
                        payload.title,

                    message:
                        payload.message,

                    type:
                        payload.type ||
                        "SYSTEM",

                    reference_type:
                        payload.reference_type ||
                        null,

                    reference_id:
                        payload.reference_id ||
                        null,

                    is_read:
                        payload.is_read || false,

                    read_at:
                        payload.read_at ||
                        null,
                },
                transaction
            );

        await transaction.commit();

        return notification;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* =========================================================
   CREATE MULTIPLE NOTIFICATIONS
   Internal Module Use
========================================================= */

const createNotifications = async (
    payload
) => {
    const transaction =
        await sequelize.transaction();

    try {
        if (
            !Array.isArray(payload) ||
            payload.length === 0
        ) {
            throw new ApiError(
                422,
                "Notification data is required."
            );
        }

        const notifications =
            await adminNotificationRepository.createNotifications(
                payload.map(
                    (item) => ({
                        user_id:
                            item.user_id,

                        title:
                            item.title,

                        message:
                            item.message,

                        type:
                            item.type ||
                            "SYSTEM",

                        reference_type:
                            item.reference_type ||
                            null,

                        reference_id:
                            item.reference_id ||
                            null,

                        is_read:
                            item.is_read ||
                            false,

                        read_at:
                            item.read_at ||
                            null,
                    })
                ),
                transaction
            );

        await transaction.commit();

        return notifications;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* =========================================================
   GET NOTIFICATION
========================================================= */

const getNotification = async (
    uuid
) => {
    const notification =
        await adminNotificationRepository.findByUuid(
            uuid,
            {
                include: [],
            }
        );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found."
        );
    }

    return notification;
};

/* =========================================================
   GET NOTIFICATIONS
========================================================= */

const getNotifications = async (
    query = {}
) => {
    return await adminNotificationRepository.getNotificationsList(
        query
    );
};

/* =========================================================
   GET USER NOTIFICATIONS
========================================================= */

const getUserNotifications = async (
    userId,
    query = {}
) => {
    return await adminNotificationRepository.getUserNotifications(
        userId,
        query
    );
};

/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

const getUnreadNotifications = async (
    userId
) => {
    return await adminNotificationRepository.getUnreadNotifications(
        userId
    );
};

/* =========================================================
   GET UNREAD COUNT
========================================================= */

const getUnreadNotificationCount = async (
    userId
) => {
    return await adminNotificationRepository.getUnreadNotificationCount(
        userId
    );
};

/* =========================================================
   MARK AS READ
========================================================= */

const markNotificationAsRead = async (
    uuid,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const notification =
            await adminNotificationRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!notification) {
            throw new ApiError(
                404,
                "Notification not found."
            );
        }

        /* =========================
           Ownership Check
        ========================= */

        if (
            Number(notification.user_id) !==
            Number(userId)
        ) {
            throw new ApiError(
                403,
                "You are not allowed to update this notification."
            );
        }

        await adminNotificationRepository.markAsRead(
            notification,
            new Date(),
            transaction
        );

        await transaction.commit();

        return await adminNotificationRepository.findByUuid(
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
   MARK AS UNREAD
========================================================= */

const markNotificationAsUnread =
    async (
        uuid,
        userId
    ) => {
        const transaction =
            await sequelize.transaction();

        try {
            const notification =
                await adminNotificationRepository.findByUuid(
                    uuid,
                    {
                        transaction,
                    }
                );

            if (!notification) {
                throw new ApiError(
                    404,
                    "Notification not found."
                );
            }

            if (
                Number(notification.user_id) !==
                Number(userId)
            ) {
                throw new ApiError(
                    403,
                    "You are not allowed to update this notification."
                );
            }

            await adminNotificationRepository.markAsUnread(
                notification,
                transaction
            );

            await transaction.commit();

            return await adminNotificationRepository.findByUuid(
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
   MARK ALL AS READ
========================================================= */

const markAllNotificationsAsRead =
    async (
        userId
    ) => {
        const transaction =
            await sequelize.transaction();

        try {
            const result =
                await adminNotificationRepository.markAllAsRead(
                    userId,
                    new Date(),
                    transaction
                );

            await transaction.commit();

            return {
                updatedCount:
                    result[0] || 0,
            };
        } catch (error) {
            if (!transaction.finished) {
                await transaction.rollback();
            }

            logger.error(error);
            throw error;
        }
    };

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification = async (
    uuid,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const notification =
            await adminNotificationRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!notification) {
            throw new ApiError(
                404,
                "Notification not found."
            );
        }

        if (
            Number(notification.user_id) !==
            Number(userId)
        ) {
            throw new ApiError(
                403,
                "You are not allowed to delete this notification."
            );
        }

        await adminNotificationRepository.deleteNotification(
            notification,
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
   EXPORTS
========================================================= */

module.exports = {
    createNotification,
    createNotifications,

    getNotification,
    getNotifications,
    getUserNotifications,

    getUnreadNotifications,
    getUnreadNotificationCount,

    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,

    deleteNotification,
};