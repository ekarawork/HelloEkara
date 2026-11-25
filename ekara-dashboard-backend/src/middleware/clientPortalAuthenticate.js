"use strict";

const jwt = require("jsonwebtoken");

const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");

const {
    user: User,
    client,
} = require("../database/models");

/* =========================================================
   CLIENT PORTAL AUTHENTICATION
========================================================= */

const clientPortalAuthenticate = asyncHandler(
    async (req, res, next) => {
        /* =====================================================
           GET AUTHORIZATION HEADER
        ===================================================== */

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            throw new ApiError(
                401,
                "Unauthorized. Access token is missing."
            );
        }

        const token =
            authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized. Access token is missing."
            );
        }

        /* =====================================================
           1. CHECK CLIENT PORTAL PREVIEW TOKEN
        ===================================================== */

        let previewPayload = null;

        try {
            previewPayload = jwt.verify(
                token,
                process.env.CLIENT_PORTAL_PREVIEW_SECRET,
                {
                    issuer: "ekara-admin",
                    audience: "ekara-client-portal",
                }
            );
        } catch (error) {
            /*
             * Token is not a valid preview token.
             *
             * We will try the normal CLIENT JWT below.
             */
            previewPayload = null;
        }

        /* =====================================================
           PREVIEW TOKEN
        ===================================================== */

        if (
            previewPayload &&
            previewPayload.type ===
                "CLIENT_PORTAL_PREVIEW"
        ) {
            /* -------------------------------------------------
               Validate client UUID
            ------------------------------------------------- */

            if (!previewPayload.client_uuid) {
                throw new ApiError(
                    401,
                    "Invalid client portal preview token."
                );
            }

            /* -------------------------------------------------
               Find active client
            ------------------------------------------------- */

            const clientData =
                await client.findOne({
                    where: {
                        uuid:
                            previewPayload.client_uuid,
                        status: "ACTIVE",
                    },

                    attributes: [
                        "id",
                        "uuid",
                        "user_id",
                        "name",
                        "email",
                        "login_id",
                        "profile_photo",
                        "monthly_service_fee",
                        "status",
                    ],
                });

            if (!clientData) {
                throw new ApiError(
                    401,
                    "Client is no longer available."
                );
            }

            /* -------------------------------------------------
               Attach client portal information
            ------------------------------------------------- */

            req.user = {
                id: previewPayload.admin_id,
                role:
                    previewPayload.admin_role,
                email:
                    previewPayload.client_email,
                isClientPortalPreview: true,
            };

            req.client = clientData;

            req.clientPortal = {
                mode: "PREVIEW",
                clientId: clientData.id,
                clientUuid: clientData.uuid,
                adminId:
                    previewPayload.admin_id,
                adminRole:
                    previewPayload.admin_role,
            };

            return next();
        }

        /* =====================================================
           2. NORMAL CLIENT JWT
        ===================================================== */

        let userPayload;

        try {
            userPayload = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET
            );
        } catch (error) {
            throw new ApiError(
                401,
                "Invalid or expired access token."
            );
        }

        /* =====================================================
           FIND USER
        ===================================================== */

        const user =
            await User.findByPk(
                userPayload.id
            );

        if (!user) {
            throw new ApiError(
                401,
                "User not found."
            );
        }

        /* =====================================================
           CHECK USER STATUS
        ===================================================== */

        if (user.status !== "ACTIVE") {
            throw new ApiError(
                403,
                "Your account is inactive."
            );
        }

        /* =====================================================
           ONLY CLIENT ALLOWED
        ===================================================== */

        if (user.role !== "CLIENT") {
            throw new ApiError(
                403,
                "You don't have permission to access the client portal."
            );
        }

        /* =====================================================
           FIND CLIENT
        ===================================================== */

        const clientData =
            await client.findOne({
                where: {
                    user_id: user.id,
                    status: "ACTIVE",
                },

                attributes: [
                    "id",
                    "uuid",
                    "user_id",
                    "name",
                    "email",
                    "login_id",
                    "profile_photo",
                    "monthly_service_fee",
                    "status",
                ],
            });

        if (!clientData) {
            throw new ApiError(
                404,
                "Active client profile not found."
            );
        }

        /* =====================================================
           ATTACH USER
        ===================================================== */

        req.user = {
            id: user.id,
            uuid: user.uuid,
            role: user.role,
            email: user.email,
            isClientPortalPreview: false,
        };

        /* =====================================================
           ATTACH CLIENT
        ===================================================== */

        req.client = clientData;

        /* =====================================================
           CLIENT PORTAL INFORMATION
        ===================================================== */

        req.clientPortal = {
            mode: "CLIENT",
            clientId: clientData.id,
            clientUuid: clientData.uuid,
            userId: user.id,
        };

        /* =====================================================
           NEXT
        ===================================================== */

        next();
    }
);

/* =========================================================
   EXPORT
========================================================= */

module.exports =
    clientPortalAuthenticate;