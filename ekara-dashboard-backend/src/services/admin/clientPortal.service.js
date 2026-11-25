"use strict";

const jwt = require("jsonwebtoken");

const {
    clientPortalRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* =========================================================
   CONSTANTS
========================================================= */

const PREVIEW_TOKEN_EXPIRES_IN =
    process.env.CLIENT_PORTAL_PREVIEW_EXPIRES_IN || "1h";

/* =========================================================
   GET PREVIEW SECRET
========================================================= */

const getPreviewSecret = () => {
    const secret =
        process.env.CLIENT_PORTAL_PREVIEW_SECRET;

    if (!secret) {
        throw new ApiError(
            500,
            "Client portal preview secret is not configured."
        );
    }

    return secret;
};

/* =========================================================
   CREATE CLIENT PORTAL PREVIEW TOKEN
========================================================= */

const createClientPortalAccess = async (
    clientUuid,
    adminUser
) => {
    /* -----------------------------------------------------
       Validate admin user
    ----------------------------------------------------- */

    if (!adminUser) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    /* -----------------------------------------------------
       Only ADMIN / SUPER_ADMIN allowed
    ----------------------------------------------------- */

    const roles = Array.isArray(adminUser.roles)
        ? adminUser.roles
        : [adminUser.role || adminUser.roles];

    const normalizedRoles = roles
        .filter(Boolean)
        .map((role) =>
            String(role).toUpperCase()
        );

    const isAdmin =
        normalizedRoles.includes("ADMIN") ||
        normalizedRoles.includes("SUPER_ADMIN");

    if (!isAdmin) {
        throw new ApiError(
            403,
            "You are not authorized to view the client portal."
        );
    }

    /* -----------------------------------------------------
       Find active client
    ----------------------------------------------------- */

    const clientData =
        await clientPortalRepository.findActiveClientByUuid(
            clientUuid
        );

    if (!clientData) {
        throw new ApiError(
            404,
            "Active client not found."
        );
    }

    /* -----------------------------------------------------
       Preview token payload
    ----------------------------------------------------- */

    const payload = {
        type: "CLIENT_PORTAL_PREVIEW",

        client_id: clientData.id,

        client_uuid: clientData.uuid,

        client_email: clientData.email,

        admin_id: adminUser.id,

        admin_role:
            normalizedRoles.includes("SUPER_ADMIN")
                ? "SUPER_ADMIN"
                : "ADMIN",
    };

    /* -----------------------------------------------------
       Generate temporary token
    ----------------------------------------------------- */

    const previewToken = jwt.sign(
        payload,
        getPreviewSecret(),
        {
            expiresIn:
                PREVIEW_TOKEN_EXPIRES_IN,
            issuer: "ekara-admin",
            audience: "ekara-client-portal",
        }
    );

    return {
        token: previewToken,

        expiresIn:
            PREVIEW_TOKEN_EXPIRES_IN,

        client: {
            id: clientData.id,
            uuid: clientData.uuid,
            name: clientData.name,
            email: clientData.email,
            profile_photo:
                clientData.profile_photo,
        },
    };
};

/* =========================================================
   VERIFY CLIENT PORTAL PREVIEW TOKEN
========================================================= */

const verifyClientPortalAccess = async (
    token
) => {
    if (!token) {
        throw new ApiError(
            401,
            "Client portal access token is required."
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            token,
            getPreviewSecret(),
            {
                issuer: "ekara-admin",
                audience: "ekara-client-portal",
            }
        );
    } catch (error) {
        if (
            error &&
            error.name === "TokenExpiredError"
        ) {
            throw new ApiError(
                401,
                "Client portal access token has expired."
            );
        }

        throw new ApiError(
            401,
            "Invalid client portal access token."
        );
    }

    /* -----------------------------------------------------
       Validate token type
    ----------------------------------------------------- */

    if (
        decoded.type !==
        "CLIENT_PORTAL_PREVIEW"
    ) {
        throw new ApiError(
            401,
            "Invalid client portal access token."
        );
    }

    /* -----------------------------------------------------
       Verify client still exists and is active
    ----------------------------------------------------- */

    const clientData =
        await clientPortalRepository.findActiveClientByUuid(
            decoded.client_uuid
        );

    if (!clientData) {
        throw new ApiError(
            401,
            "Client is no longer available."
        );
    }

    return {
        token: decoded,

        client: {
            id: clientData.id,
            uuid: clientData.uuid,
            name: clientData.name,
            email: clientData.email,
            profile_photo:
                clientData.profile_photo,
        },
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    createClientPortalAccess,
    verifyClientPortalAccess,
};