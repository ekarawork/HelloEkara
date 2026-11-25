"use strict";

const {
    clientPortalService,
} = require("../../services/index");

/* =========================================================
   CREATE CLIENT PORTAL ACCESS
========================================================= */

const createClientPortalAccess = async (
    req,
    res,
    next
) => {
    try {
        const {
            uuid,
        } = req.params;

        const data =
            await clientPortalService.createClientPortalAccess(
                uuid,
                req.user
            );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message:
                "Client portal access created successfully.",
            data,
            errors: null,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================================
   VERIFY CLIENT PORTAL ACCESS
========================================================= */

const verifyClientPortalAccess = async (
    req,
    res,
    next
) => {
    try {
        const token =
            req.headers.authorization
                ?.replace("Bearer ", "")
                .trim();

        const data =
            await clientPortalService.verifyClientPortalAccess(
                token
            );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message:
                "Client portal access verified successfully.",
            data,
            errors: null,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    createClientPortalAccess,
    verifyClientPortalAccess,
};