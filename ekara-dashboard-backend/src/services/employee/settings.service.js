"use strict";

const ApiError = require("../../utils/ApiError");

const {
    employeeSettingsRepository,
} = require("../../repositories/index");

const {
    comparePassword,
    hashPassword,
} = require("../../utils/password");

/* =========================================================
   GET EMPLOYEE PROFILE
========================================================= */

const getEmployeeProfile = async (userId) => {
    const employee =
        await employeeSettingsRepository.getEmployeeProfile(
            userId
        );

    if (!employee) {
        throw new ApiError(
            404,
            "Employee profile not found."
        );
    }

    /* =====================================================
       CHECK EMPLOYEE ROLE
    ===================================================== */

    if (employee.role !== "EMPLOYEE") {
        throw new ApiError(
            403,
            "You are not authorized to access employee settings."
        );
    }

    return employee;
};

/* =========================================================
   UPDATE EMPLOYEE PROFILE
========================================================= */

const updateEmployeeProfile = async (
    userId,
    payload
) => {
    const {
        first_name,
        last_name,
        email,
    } = payload;

    /* =====================================================
       CHECK EMPLOYEE EXISTS
    ===================================================== */

    const employee =
        await employeeSettingsRepository.getEmployeeProfile(
            userId
        );

    if (!employee) {
        throw new ApiError(
            404,
            "Employee profile not found."
        );
    }

    /* =====================================================
       CHECK EMPLOYEE ROLE
    ===================================================== */

    if (employee.role !== "EMPLOYEE") {
        throw new ApiError(
            403,
            "You are not authorized to update employee settings."
        );
    }

    /* =====================================================
       CHECK ACCOUNT STATUS
    ===================================================== */

    if (employee.status !== "ACTIVE") {
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
        await employeeSettingsRepository.findUserByEmail(
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
       PREPARE UPDATE DATA
    ===================================================== */

    const updateData = {
        first_name: first_name.trim(),
        last_name: last_name
            ? last_name.trim()
            : null,
        email: normalizedEmail,
    };

    /* =====================================================
       UPDATE EMPLOYEE PROFILE
    ===================================================== */

    const updatedEmployee =
        await employeeSettingsRepository.updateEmployeeProfile(
            userId,
            updateData
        );

    return updatedEmployee;
};

/* =========================================================
   CHANGE EMPLOYEE PASSWORD
========================================================= */

const changeEmployeePassword = async (
    userId,
    payload
) => {
    const {
        current_password,
        new_password,
    } = payload;

    /* =====================================================
       GET EMPLOYEE USER
    ===================================================== */

    const employee =
        await employeeSettingsRepository.getUserWithPassword(
            userId
        );

    if (!employee) {
        throw new ApiError(
            404,
            "Employee account not found."
        );
    }

    /* =====================================================
       CHECK EMPLOYEE ROLE
    ===================================================== */

    if (employee.role !== "EMPLOYEE") {
        throw new ApiError(
            403,
            "You are not authorized to change this password."
        );
    }

    /* =====================================================
       CHECK ACCOUNT STATUS
    ===================================================== */

    if (employee.status !== "ACTIVE") {
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
            employee.password
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
            employee.password
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
       UPDATE EMPLOYEE PASSWORD
    ===================================================== */

    await employeeSettingsRepository.updateEmployeePassword(
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
    getEmployeeProfile,
    updateEmployeeProfile,
    changeEmployeePassword,
};