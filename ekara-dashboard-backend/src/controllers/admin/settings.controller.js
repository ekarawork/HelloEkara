"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    settingsService,
} = require("../../services/index");

const {
    updateAdminProfileSchema,
    changeAdminPasswordSchema,
    paymentReminderSettingsSchema 
} = require("../../validations/admin/settings.validation");

/* =========================================================
   GET ADMIN PROFILE
========================================================= */

const getAdminProfile = asyncHandler(
    async (req, res) => {

        const result =
            await settingsService.getAdminProfile(
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Admin profile fetched successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

const updateAdminProfile = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = updateAdminProfileSchema.validate(
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
            await settingsService.updateAdminProfile(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Admin profile updated successfully.",
            result,
            200
        );
    }
);

/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

const changeAdminPassword = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = changeAdminPasswordSchema.validate(
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
            await settingsService.changeAdminPassword(
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
   GET PAYMENT REMINDER SETTINGS
========================================================= */

const getPaymentReminderSettings = asyncHandler(
    async (req, res) => {

        const result =
            await settingsService.getPaymentReminderSettings();

        return ResponseHelper.success(
            res,
            "Payment reminder settings fetched successfully.",
            result,
            200
        );
    }
);


/* =========================================================
   UPDATE PAYMENT REMINDER SETTINGS
========================================================= */

const updatePaymentReminderSettings = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = paymentReminderSettingsSchema.validate(
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
            await settingsService.updatePaymentReminderSettings(
                req.user.id,
                value
            );

        return ResponseHelper.success(
            res,
            "Payment reminder settings updated successfully.",
            result,
            200
        );
    }
);


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,

    getPaymentReminderSettings,
    updatePaymentReminderSettings,
};