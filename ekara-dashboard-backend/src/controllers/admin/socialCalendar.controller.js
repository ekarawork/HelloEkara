"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminSocialCalendarService,
} = require("../../services/index");

const {
    createSocialCalendarSchema,
    updateSocialCalendarSchema,
} = require("../../validations/admin/socialCalendar.validation");

/* ========================= Create Social Calendar Post ========================= */

// Create social calendar post
const createSocialCalendarPost = asyncHandler(async (req, res) => {
    const { error, value } = createSocialCalendarSchema.validate(
        req.body,
        {
            abortEarly: true,
            convert: true,
        }
    );

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const socialCalendarPost =
        await adminSocialCalendarService.createSocialCalendarPost(
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Social calendar post created successfully.",
        socialCalendarPost,
        201
    );
});

/* ========================= Get Social Calendar Posts ========================= */

// Get/list social calendar posts
const getSocialCalendarPosts = asyncHandler(async (req, res) => {
    const query = {
        client_id: req.query.client_id
            ? Number(req.query.client_id)
            : undefined,

        start_date: req.query.start_date || undefined,

        end_date: req.query.end_date || undefined,

        platform: req.query.platform || undefined,

        status: req.query.status || undefined,

        content_type: req.query.content_type || undefined,
    };

    const socialCalendarPosts =
        await adminSocialCalendarService.getSocialCalendarPosts(
            query
        );

    return ResponseHelper.success(
        res,
        "Social calendar posts fetched successfully.",
        {
            rows: socialCalendarPosts,
        }
    );
});

/* ========================= Get Social Calendar Post ========================= */

// Get social calendar post details
const getSocialCalendarPost = asyncHandler(async (req, res) => {
    const socialCalendarPost =
        await adminSocialCalendarService.getSocialCalendarPost(
            req.params.uuid
        );

    return ResponseHelper.success(
        res,
        "Social calendar post fetched successfully.",
        socialCalendarPost
    );
});

/* ========================= Update Social Calendar Post ========================= */

// Update social calendar post
const updateSocialCalendarPost = asyncHandler(async (req, res) => {
    const { error, value } = updateSocialCalendarSchema.validate(
        req.body,
        {
            abortEarly: true,
            convert: true,
        }
    );

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const socialCalendarPost =
        await adminSocialCalendarService.updateSocialCalendarPost(
            req.params.uuid,
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Social calendar post updated successfully.",
        socialCalendarPost
    );
});

/* ========================= Delete Social Calendar Post ========================= */

// Permanently delete social calendar post
const deleteSocialCalendarPost = asyncHandler(async (req, res) => {
    await adminSocialCalendarService.deleteSocialCalendarPost(
        req.params.uuid
    );

    return ResponseHelper.success(
        res,
        "Social calendar post permanently deleted."
    );
});

/* ========================= Export ========================= */

module.exports = {
    createSocialCalendarPost,
    getSocialCalendarPosts,
    getSocialCalendarPost,
    updateSocialCalendarPost,
    deleteSocialCalendarPost,
};