"use strict";

const ApiError = require("../../utils/ApiError");

const {
    settingsRepository,
} = require("../../repositories/index");
const {
    comparePassword,
    hashPassword,
} = require("../../utils/password");

/* =========================================================
   GET ADMIN PROFILE
========================================================= */

const getAdminProfile = async (userId) => {
    const admin = await settingsRepository.getAdminProfile(
        userId
    );

    if (!admin) {
        throw new ApiError(
            404,
            "Admin profile not found."
        );
    }

    return admin;
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

const updateAdminProfile = async (userId, payload) => {
    const {
        first_name,
        last_name,
        email,
    } = payload;

    /* =====================================================
       CHECK ADMIN EXISTS
    ===================================================== */

    const admin =
        await settingsRepository.getAdminProfile(
            userId
        );

    if (!admin) {
        throw new ApiError(
            404,
            "Admin profile not found."
        );
    }

    /* =====================================================
       CHECK EMAIL UNIQUENESS
    ===================================================== */

    const normalizedEmail =
        email.trim().toLowerCase();

    const existingUser =
        await settingsRepository.findUserByEmail(
            normalizedEmail,
            userId
        );

    if (existingUser) {
        throw new ApiError(
            409,
            "Email address is already in use."
        );
    }

    /* =====================================================
       UPDATE DATA
    ===================================================== */

    const updateData = {
        first_name: first_name.trim(),
        last_name: last_name
            ? last_name.trim()
            : null,
        email: normalizedEmail,
    };

    const updatedAdmin =
        await settingsRepository.updateAdminProfile(
            userId,
            updateData
        );

    return updatedAdmin;
};

/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

const changeAdminPassword = async (
    userId,
    payload
) => {
    const {
        current_password,
        new_password,
    } = payload;

    /* =====================================================
       GET USER
    ===================================================== */

    const admin =
        await settingsRepository.getUserWithPassword(
            userId
        );

    if (!admin) {
        throw new ApiError(
            404,
            "Admin account not found."
        );
    }

    /* =====================================================
       ACCOUNT STATUS
    ===================================================== */

    if (admin.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "Your account is not active."
        );
    }

    /* =====================================================
       VERIFY CURRENT PASSWORD
    ===================================================== */

    const validPassword =
        await comparePassword(
            current_password,
            admin.password
        );

    if (!validPassword) {
        throw new ApiError(
            401,
            "Current password is incorrect."
        );
    }

    /* =====================================================
       CHECK NEW PASSWORD
    ===================================================== */

    const samePassword =
        await comparePassword(
            new_password,
            admin.password
        );

    if (samePassword) {
        throw new ApiError(
            400,
            "New password must be different from your current password."
        );
    }

    /* =====================================================
       HASH NEW PASSWORD
    ===================================================== */

    const hashedPassword =
        await hashPassword(new_password);

    /* =====================================================
       UPDATE PASSWORD
    ===================================================== */

    await settingsRepository.updateAdminPassword(
        userId,
        hashedPassword
    );

    return {
        success: true,
    };
};

/* =========================================================
   GET PAYMENT REMINDER SETTINGS
   Global defaults used for new payments
========================================================= */

const getPaymentReminderSettings = async () => {
    const settings =
        await settingsRepository.getPaymentReminderSettings();

    if (!settings) {
        throw new ApiError(
            404,
            "Payment reminder settings not found."
        );
    }

    return settings;
};

/* =========================================================
   UPDATE PAYMENT REMINDER SETTINGS
   These settings are defaults for new payments.
========================================================= */

const updatePaymentReminderSettings = async (
    userId,
    payload
) => {
    /* =====================================================
       UPDATE SETTINGS
    ===================================================== */

    const settings =
        await settingsRepository.updatePaymentReminderSettings(
            payload,
            userId
        );

    if (!settings) {
        throw new ApiError(
            500,
            "Failed to update payment reminder settings."
        );
    }

    return settings;
};

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