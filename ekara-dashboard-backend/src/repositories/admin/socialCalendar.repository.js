"use strict";

const { Op } = require("sequelize");

const {
    social_calendar_post,
    client,
    user,
} = require("../../database/models");

/* ========================= Social Calendar Post ========================= */

// Create social calendar post
const createSocialCalendarPost = async (payload, transaction) => {
    return await social_calendar_post.create(payload, {
        transaction,
    });
};

// Find social calendar post by ID
const findById = async (id, options = {}) => {
    return await social_calendar_post.findByPk(id, {
        ...options,
    });
};

// Find social calendar post by UUID
const findByUuid = async (uuid, options = {}) => {
    return await social_calendar_post.findOne({
        where: { uuid },
        ...options,
    });
};

// Update social calendar post
const updateSocialCalendarPost = async (
    socialCalendarPost,
    payload,
    transaction
) => {
    return await socialCalendarPost.update(payload, {
        transaction,
    });
};

// Permanently delete social calendar post
const deleteSocialCalendarPost = async (
    socialCalendarPost,
    transaction
) => {
    return await socialCalendarPost.destroy({
        transaction,
    });
};

/* ========================= Social Calendar List ========================= */

const getSocialCalendarPosts = async ({
    client_id,
    start_date,
    end_date,
    platform,
    status,
    content_type,
}) => {
    const where = {};

    // Client filter
    if (client_id) {
        where.client_id = client_id;
    }

    // Date range filter
    if (start_date && end_date) {
        where.post_date = {
            [Op.between]: [start_date, end_date],
        };
    } else if (start_date) {
        where.post_date = {
            [Op.gte]: start_date,
        };
    } else if (end_date) {
        where.post_date = {
            [Op.lte]: end_date,
        };
    }

    // Platform filter
    if (platform) {
        where.platform = platform;
    }

    // Status filter
    if (status) {
        where.status = status;
    }

    // Content type filter
    if (content_type) {
        where.content_type = content_type;
    }

    return await social_calendar_post.findAll({
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
                ],
            },
        ],

        order: [
            ["post_date", "ASC"],
            ["id", "ASC"],
        ],
    });
};

/* ========================= Social Calendar Details ========================= */

const getSocialCalendarPostDetails = async (id) => {
    return await social_calendar_post.findByPk(id, {
        include: [
            {
                model: client,
                as: "client",
                required: true,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
            },

            {
                model: user,
                as: "createdBy",
                required: false,
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                ],
            },

            {
                model: user,
                as: "updatedBy",
                required: false,
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                ],
            },
        ],
    });
};

/* ========================= Export ========================= */

module.exports = {
    // Social Calendar Post
    createSocialCalendarPost,
    findById,
    findByUuid,
    updateSocialCalendarPost,
    deleteSocialCalendarPost,

    // Social Calendar List
    getSocialCalendarPosts,

    // Social Calendar Details
    getSocialCalendarPostDetails,
};