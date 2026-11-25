"use strict";

const {
    adminSocialCalendarRepository,
    adminClientRepository,
} = require("../../repositories/index");

const {
    sequelize,
} = require("../../database/models");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= Create Social Calendar Post ========================= */

// Create social calendar post
const createSocialCalendarPost = async (payload, userId) => {
    const transaction = await sequelize.transaction();

    try {
        // Check client exists
        const client = await adminClientRepository.findById(
            payload.client_id,
            { transaction }
        );

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        // Client should be active
        if (client.status !== "ACTIVE") {
            throw new ApiError(
                400,
                "Cannot create social calendar post for an inactive client."
            );
        }

        const socialCalendarPost =
            await adminSocialCalendarRepository.createSocialCalendarPost(
                {
                    ...payload,
                    created_by: userId,
                    updated_by: userId,
                },
                transaction
            );

        await transaction.commit();

        // Return complete post details
        const createdPost =
            await adminSocialCalendarRepository.getSocialCalendarPostDetails(
                socialCalendarPost.id
            );

        return createdPost;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* ========================= Update Social Calendar Post ========================= */

// Update social calendar post
const updateSocialCalendarPost = async (
    uuid,
    payload,
    userId
) => {
    const transaction = await sequelize.transaction();

    try {
        // Find existing post
        const socialCalendarPost =
            await adminSocialCalendarRepository.findByUuid(
                uuid,
                { transaction }
            );

        if (!socialCalendarPost) {
            throw new ApiError(
                404,
                "Social calendar post not found."
            );
        }

        // If client_id is being changed, validate client
        if (
            payload.client_id &&
            Number(payload.client_id) !==
                Number(socialCalendarPost.client_id)
        ) {
            const client = await adminClientRepository.findById(
                payload.client_id,
                { transaction }
            );

            if (!client) {
                throw new ApiError(404, "Client not found.");
            }

            if (client.status !== "ACTIVE") {
                throw new ApiError(
                    400,
                    "Cannot assign social calendar post to an inactive client."
                );
            }
        }

        await adminSocialCalendarRepository.updateSocialCalendarPost(
            socialCalendarPost,
            {
                ...payload,
                updated_by: userId,
            },
            transaction
        );

        await transaction.commit();

        // Return updated post details
        const updatedPost =
            await adminSocialCalendarRepository.getSocialCalendarPostDetails(
                socialCalendarPost.id
            );

        return updatedPost;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* ========================= Get Social Calendar Post ========================= */

// Get single social calendar post
const getSocialCalendarPost = async (uuid) => {
    const socialCalendarPost =
        await adminSocialCalendarRepository.findByUuid(uuid);

    if (!socialCalendarPost) {
        throw new ApiError(
            404,
            "Social calendar post not found."
        );
    }

    const post =
        await adminSocialCalendarRepository.getSocialCalendarPostDetails(
            socialCalendarPost.id
        );

    if (!post) {
        throw new ApiError(
            404,
            "Social calendar post not found."
        );
    }

    return post;
};

/* ========================= Get Social Calendar Posts ========================= */

// Get/list social calendar posts
const getSocialCalendarPosts = async (query) => {
    return await adminSocialCalendarRepository.getSocialCalendarPosts(
        query
    );
};

/* ========================= Delete Social Calendar Post ========================= */

// Permanently delete social calendar post
const deleteSocialCalendarPost = async (uuid) => {
    const transaction = await sequelize.transaction();

    try {
        // Find post
        const socialCalendarPost =
            await adminSocialCalendarRepository.findByUuid(
                uuid,
                { transaction }
            );

        if (!socialCalendarPost) {
            throw new ApiError(
                404,
                "Social calendar post not found."
            );
        }

        // Permanent delete
        await adminSocialCalendarRepository.deleteSocialCalendarPost(
            socialCalendarPost,
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

/* ========================= Export ========================= */

module.exports = {
    createSocialCalendarPost,
    updateSocialCalendarPost,
    getSocialCalendarPost,
    getSocialCalendarPosts,
    deleteSocialCalendarPost,
};