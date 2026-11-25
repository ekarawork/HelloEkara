"use strict";

const { Op } = require("sequelize");

const {
    social_calendar_post,
} = require("../../database/models");

/* ========================= Social Calendar Dashboard ========================= */

// Get social calendar posts for authenticated client
const getClientSocialCalendarPosts = async ({
    client_id,
    start_date,
    end_date,
    platform,
    status,
    content_type,
}) => {
    const where = {
        client_id,
    };

    /* =========================================================
       DATE RANGE FILTER
    ========================================================= */

    if (start_date && end_date) {
        where.post_date = {
            [Op.between]: [
                start_date,
                end_date,
            ],
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

    /* =========================================================
       PLATFORM FILTER
    ========================================================= */

    if (platform) {
        where.platform = platform;
    }

    /* =========================================================
       STATUS FILTER
    ========================================================= */

    if (status) {
        where.status = status;
    }

    /* =========================================================
       CONTENT TYPE FILTER
    ========================================================= */

    if (content_type) {
        where.content_type = content_type;
    }

    /* =========================================================
       FETCH POSTS
    ========================================================= */

    return await social_calendar_post.findAll({
        where,

        attributes: [
            "id",
            "uuid",
            "client_id",
            "post_date",
            "platform",
            "status",
            "content_type",
            "note",
            "createdAt",
            "updatedAt",
        ],

        order: [
            [
                "post_date",
                "ASC",
            ],
            [
                "id",
                "ASC",
            ],
        ],
    });
};

/* ========================= Export ========================= */

module.exports = {
    getClientSocialCalendarPosts,
};