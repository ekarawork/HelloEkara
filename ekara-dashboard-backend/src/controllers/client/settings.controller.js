"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    clientSettingsService,
} = require("../../services/index");

const {
    updateClientProfileSchema,
    changeClientPasswordSchema,
} = require("../../validations/client/settings.validation");

/* =========================================================
   GET CLIENT PROFILE
========================================================= */

const getClientProfile = asyncHandler(
    async (req, res) => {

        const result =
            await clientSettingsService.getClientProfile(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Client profile fetched successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   UPDATE CLIENT PROFILE
========================================================= */

const updateClientProfile = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = updateClientProfileSchema.validate(
            req.body,
            {
                abortEarly: true,
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

        const result =
            await clientSettingsService.updateClientProfile(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Client profile updated successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   CHANGE CLIENT PASSWORD
========================================================= */

const changeClientPassword = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = changeClientPasswordSchema.validate(
            req.body,
            {
                abortEarly: true,
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

        const result =
            await clientSettingsService.changeClientPassword(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Password updated successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientProfile,
    updateClientProfile,
    changeClientPassword,
};