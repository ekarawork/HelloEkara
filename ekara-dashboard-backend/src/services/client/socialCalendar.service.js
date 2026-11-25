"use strict";

const {
    clientSocialCalendarRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* ========================= Get Social Calendar Dashboard ========================= */

// Get social calendar dashboard for authenticated client
const getClientSocialCalendarDashboard = async (
    clientId,
    {
        startDate,
        endDate,
        platform,
        status,
        contentType,
    } = {}
) => {
    /* =========================================================
       CLIENT AUTHENTICATION
    ========================================================= */

    if (!clientId) {
        throw new ApiError(
            401,
            "Client authentication is required."
        );
    }

    /* =========================================================
       DATE VALIDATION
    ========================================================= */

    if (
        startDate &&
        endDate &&
        new Date(startDate) >
            new Date(endDate)
    ) {
        throw new ApiError(
            400,
            "Start date cannot be greater than end date."
        );
    }

    /* =========================================================
       PLATFORM VALIDATION
    ========================================================= */

    const allowedPlatforms = [
        "instagram",
        "facebook",
        "linkedin",
        "youtube",
    ];

    if (
        platform &&
        !allowedPlatforms.includes(
            platform
        )
    ) {
        throw new ApiError(
            400,
            "Invalid social media platform."
        );
    }

    /* =========================================================
       STATUS VALIDATION
    ========================================================= */

    const allowedStatuses = [
        "draft",
        "approved",
        "scheduled",
        "published",
    ];

    if (
        status &&
        !allowedStatuses.includes(
            status
        )
    ) {
        throw new ApiError(
            400,
            "Invalid social calendar status."
        );
    }

    /* =========================================================
       CONTENT TYPE VALIDATION
    ========================================================= */

    const allowedContentTypes = [
        "post",
        "reel",
        "carousel",
        "story",
    ];

    if (
        contentType &&
        !allowedContentTypes.includes(
            contentType
        )
    ) {
        throw new ApiError(
            400,
            "Invalid social calendar content type."
        );
    }

    /* =========================================================
       GET POSTS
    ========================================================= */

    const posts =
        await clientSocialCalendarRepository.getClientSocialCalendarPosts(
            {
                client_id: clientId,
                start_date: startDate,
                end_date: endDate,
                platform,
                status,
                content_type:
                    contentType,
            }
        );

    /* =========================================================
       RETURN DASHBOARD DATA
    ========================================================= */

    return {
        rows: posts,
    };
};

/* ========================= Export ========================= */

module.exports = {
    getClientSocialCalendarDashboard,
};