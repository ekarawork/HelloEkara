"use strict";

const ApiError = require("../../utils/ApiError");

const {
    clientSettingsRepository,
} = require("../../repositories/index");

const {
    comparePassword,
    hashPassword,
} = require("../../utils/password");

/* =========================================================
   GET CLIENT PROFILE
========================================================= */

const getClientProfile = async (userId) => {
    const client =
        await clientSettingsRepository.getClientProfile(
            userId
        );

    if (!client) {
        throw new ApiError(
            404,
            "Client profile not found."
        );
    }

    if (client.role !== "CLIENT") {
        throw new ApiError(
            403,
            "You are not authorized to access client settings."
        );
    }

    return client;
};

/* =========================================================
   UPDATE CLIENT PROFILE
========================================================= */

const updateClientProfile = async (
    userId,
    payload
) => {
    const {
        first_name,
        last_name,
        email,
    } = payload;

    /* =====================================================
       CHECK CLIENT EXISTS
    ===================================================== */

    const client =
        await clientSettingsRepository.getClientProfile(
            userId
        );

    if (!client) {
        throw new ApiError(
            404,
            "Client profile not found."
        );
    }

    /* =====================================================
       CHECK CLIENT ROLE
    ===================================================== */

    if (client.role !== "CLIENT") {
        throw new ApiError(
            403,
            "You are not authorized to update client settings."
        );
    }

    /* =====================================================
       CHECK ACCOUNT STATUS
    ===================================================== */

    if (client.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "Your account is not active."
        );
    }

    /* =====================================================
       CHECK EMAIL UNIQUENESS
    ===================================================== */

    const normalizedEmail =
        email.trim().toLowerCase();

    const existingUser =
        await clientSettingsRepository.findUserByEmail(
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

    const updatedClient =
        await clientSettingsRepository.updateClientProfile(
            userId,
            updateData
        );

    return updatedClient;
};

/* =========================================================
   CHANGE CLIENT PASSWORD
========================================================= */

const changeClientPassword = async (
    userId,
    payload
) => {
    const {
        current_password,
        new_password,
    } = payload;

    /* =====================================================
       GET CLIENT USER
    ===================================================== */

    const client =
        await clientSettingsRepository.getUserWithPassword(
            userId
        );

    if (!client) {
        throw new ApiError(
            404,
            "Client account not found."
        );
    }

    /* =====================================================
       CHECK CLIENT ROLE
    ===================================================== */

    if (client.role !== "CLIENT") {
        throw new ApiError(
            403,
            "You are not authorized to change this password."
        );
    }

    /* =====================================================
       ACCOUNT STATUS
    ===================================================== */

    if (client.status !== "ACTIVE") {
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
            client.password
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
            client.password
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

    await clientSettingsRepository.updateClientPassword(
        userId,
        hashedPassword
    );

    return {
        success: true,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientProfile,
    updateClientProfile,
    changeClientPassword,
};