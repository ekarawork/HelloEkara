"use strict";

const bcrypt = require("bcryptjs");

const {
    adminEmployeeRepository,
} = require("../../repositories/index");

const {
    uploadToCloudinary,
    deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const ApiError = require("../../utils/ApiError");

const {
    sequelize,
} = require("../../database/models");

const logger = require("../../utils/winston.util");

/* ========================= Helpers ========================= */

// Delete uploaded Cloudinary files when transaction fails
const deleteUploadedFiles = async (files = []) => {
    for (const file of files) {
        try {
            await deleteCloudinaryFile(
                file.url,
                file.resourceType
            );
        } catch (error) {
            logger.error(
                `Failed to delete Cloudinary file: ${error.message}`
            );
        }
    }
};

// Remove password from employee response
const sanitizeEmployee = (employeeData) => {
    const data =
        typeof employeeData.toJSON === "function"
            ? employeeData.toJSON()
            : { ...employeeData };

    delete data.password;

    // Remove nested user password as well
    if (data.user) {
        delete data.user.password;
    }

    return data;
};

/* ========================= Create Employee ========================= */

const createEmployee = async (
    payload,
    files,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    const uploadedFiles = [];

    try {
        /* ========================= Duplicate Employee Email ========================= */

        const employeeEmailExists =
            await adminEmployeeRepository.findByEmail(
                payload.email,
                {
                    paranoid: false,
                    transaction,
                }
            );

        if (employeeEmailExists) {
            throw new ApiError(
                409,
                "Employee email already exists."
            );
        }

        /* ========================= Duplicate User Email ========================= */

        const userEmailExists =
            await adminEmployeeRepository.findUserByEmail(
                payload.email,
                {
                    transaction,
                }
            );

        if (userEmailExists) {
            throw new ApiError(
                409,
                "Email is already registered."
            );
        }

        /* ========================= Duplicate Employee Code ========================= */

        const employeeCodeExists =
            await adminEmployeeRepository.findByEmployeeCode(
                payload.employee_code,
                {
                    paranoid: false,
                    transaction,
                }
            );

        if (employeeCodeExists) {
            throw new ApiError(
                409,
                "Employee code already exists."
            );
        }

        /* ========================= Password ========================= */

        const hashedPassword =
            await bcrypt.hash(
                payload.password,
                12
            );

        /* ========================= Profile Image ========================= */

        let profileImage = null;

        if (
            files &&
            files.profile_image &&
            files.profile_image[0]
        ) {
            const profileImageFile =
                files.profile_image[0];

            const result =
                await uploadToCloudinary(
                    profileImageFile,
                    {
                        folder: `${process.env.CLOUDINARY_BASE_FOLDER}/employees/profile`,
                        resourceType: "image",
                    }
                );

            profileImage =
                result.secure_url;

            uploadedFiles.push({
                url: result.secure_url,
                resourceType: "image",
            });
        }

        /* ========================= Employee Status ========================= */

        const employeeStatus =
            payload.status || "ACTIVE";

        /* ========================= Create Login User ========================= */

        const loginUser =
            await adminEmployeeRepository.createUser(
                {
                    first_name:
                        payload.first_name,

                    last_name:
                        payload.last_name,

                    email:
                        payload.email,

                    password:
                        hashedPassword,

                    role: "EMPLOYEE",

                    status:
                        employeeStatus,
                },
                transaction
            );

        /* ========================= Create Employee ========================= */

        const employee =
            await adminEmployeeRepository.createEmployee(
                {
                    ...payload,

                    user_id:
                        loginUser.id,

                    password:
                        hashedPassword,

                    profile_image:
                        profileImage,

                    created_by:
                        userId,

                    updated_by:
                        userId,
                },
                transaction
            );

        /* ========================= Commit ========================= */

        await transaction.commit();

        /* ========================= Get Created Employee ========================= */

        const createdEmployee =
            await adminEmployeeRepository.getEmployeeDetails(
                employee.uuid
            );

        return sanitizeEmployee(
            createdEmployee
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (uploadedFiles.length > 0) {
            await deleteUploadedFiles(
                uploadedFiles
            );
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Update Employee ========================= */

const updateEmployee = async (
    uuid,
    payload,
    files,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    const uploadedFiles = [];

    try {
        /* ========================= Find Employee ========================= */

        const employee =
            await adminEmployeeRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!employee) {
            throw new ApiError(
                404,
                "Employee not found."
            );
        }

        /* ========================= Find Linked User ========================= */

        let loginUser = null;

        if (employee.user_id) {
            loginUser =
                await adminEmployeeRepository.findUserById(
                    employee.user_id,
                    {
                        transaction,
                    }
                );
        }

        if (!loginUser) {
            throw new ApiError(
                404,
                "Linked employee login account not found."
            );
        }

        /* ========================= Email Check ========================= */

        if (
            payload.email &&
            payload.email !== employee.email
        ) {
            /* ========================= Employee Email ========================= */

            const employeeEmailExists =
                await adminEmployeeRepository.findByEmail(
                    payload.email,
                    {
                        paranoid: false,
                        transaction,
                    }
                );

            if (
                employeeEmailExists &&
                employeeEmailExists.id !== employee.id
            ) {
                throw new ApiError(
                    409,
                    "Employee email already exists."
                );
            }

            /* ========================= User Email ========================= */

            const userEmailExists =
                await adminEmployeeRepository.findUserByEmail(
                    payload.email,
                    {
                        transaction,
                    }
                );

            if (
                userEmailExists &&
                userEmailExists.id !== loginUser.id
            ) {
                throw new ApiError(
                    409,
                    "Email is already registered."
                );
            }
        }

        /* ========================= Employee Code Check ========================= */

        if (
            payload.employee_code &&
            payload.employee_code !==
                employee.employee_code
        ) {
            const employeeCodeExists =
                await adminEmployeeRepository.findByEmployeeCode(
                    payload.employee_code,
                    {
                        paranoid: false,
                        transaction,
                    }
                );

            if (
                employeeCodeExists &&
                employeeCodeExists.id !==
                    employee.id
            ) {
                throw new ApiError(
                    409,
                    "Employee code already exists."
                );
            }
        }

        /* ========================= Password ========================= */

        let hashedPassword = null;

        if (payload.password) {
            hashedPassword =
                await bcrypt.hash(
                    payload.password,
                    12
                );

            // Employee password
            payload.password =
                hashedPassword;
        } else {
            // Do not change employee password
            delete payload.password;
        }

        /* ========================= Old Profile Image ========================= */

        const oldProfileImage =
            employee.profile_image;

        /* ========================= New Profile Image ========================= */

        if (
            files &&
            files.profile_image &&
            files.profile_image[0]
        ) {
            const profileImageFile =
                files.profile_image[0];

            const result =
                await uploadToCloudinary(
                    profileImageFile,
                    {
                        folder: `${process.env.CLOUDINARY_BASE_FOLDER}/employees/profile`,
                        resourceType: "image",
                    }
                );

            payload.profile_image =
                result.secure_url;

            uploadedFiles.push({
                url: result.secure_url,
                resourceType: "image",
            });
        }

        /* ========================= Updated By ========================= */

        payload.updated_by =
            userId;

        /* ========================= Employee Update ========================= */

        await adminEmployeeRepository.updateEmployee(
            employee,
            payload,
            transaction
        );

        /* ========================= Linked User Update ========================= */

        const userPayload = {};

        /* ========================= Name Sync ========================= */

        if (
            payload.first_name !==
            undefined
        ) {
            userPayload.first_name =
                payload.first_name;
        }

        if (
            payload.last_name !==
            undefined
        ) {
            userPayload.last_name =
                payload.last_name;
        }

        /* ========================= Email Sync ========================= */

        if (payload.email) {
            userPayload.email =
                payload.email;
        }

        /* ========================= Password Sync ========================= */

        if (hashedPassword) {
            userPayload.password =
                hashedPassword;
        }

        /* ========================= Status Sync ========================= */

        if (payload.status) {
            userPayload.status =
                payload.status;
        }

        /* ========================= Keep Employee Role ========================= */

        // users.role must always remain EMPLOYEE.
        userPayload.role = "EMPLOYEE";

        /* ========================= Update User ========================= */

        if (
            Object.keys(userPayload)
                .length > 0
        ) {
            await adminEmployeeRepository.updateUser(
                loginUser,
                userPayload,
                transaction
            );
        }

        /* ========================= Commit ========================= */

        await transaction.commit();

        /* ========================= Delete Old Profile Image ========================= */

        if (
            files &&
            files.profile_image &&
            files.profile_image[0] &&
            oldProfileImage
        ) {
            try {
                await deleteCloudinaryFile(
                    oldProfileImage,
                    "image"
                );
            } catch (error) {
                logger.error(
                    `Failed to delete old employee profile image: ${error.message}`
                );
            }
        }

        /* ========================= Get Updated Employee ========================= */

        const updatedEmployee =
            await adminEmployeeRepository.getEmployeeDetails(
                uuid
            );

        return sanitizeEmployee(
            updatedEmployee
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (uploadedFiles.length > 0) {
            await deleteUploadedFiles(
                uploadedFiles
            );
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Get Employee ========================= */

const getEmployee = async (
    uuid
) => {
    const employee =
        await adminEmployeeRepository.getEmployeeDetails(
            uuid
        );

    if (!employee) {
        throw new ApiError(
            404,
            "Employee not found."
        );
    }

    return sanitizeEmployee(
        employee
    );
};

/* ========================= Get Employees ========================= */

const getEmployees = async (
    query
) => {
    const result =
        await adminEmployeeRepository.getEmployees(
            query
        );

    result.rows =
        result.rows.map(
            (employee) =>
                sanitizeEmployee(
                    employee
                )
        );

    return result;
};

/* ========================= Update Employee Status ========================= */

const updateEmployeeStatus = async (
    uuid,
    status,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const employee =
            await adminEmployeeRepository.updateEmployeeStatus(
                uuid,
                status,
                userId,
                transaction
            );

        if (!employee) {
            throw new ApiError(
                404,
                "Employee not found."
            );
        }

        await transaction.commit();

        return sanitizeEmployee(
            employee
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Delete Employee ========================= */

// Soft delete employee
// Linked login user will also become INACTIVE
const deleteEmployee = async (
    uuid
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const employee =
            await adminEmployeeRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!employee) {
            throw new ApiError(
                404,
                "Employee not found."
            );
        }

        await adminEmployeeRepository.deleteEmployee(
            employee,
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

/* ========================= Restore Employee ========================= */

const restoreEmployee = async (
    uuid,
    userId
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const employee =
            await adminEmployeeRepository.restoreEmployee(
                uuid,
                userId,
                transaction
            );

        if (!employee) {
            throw new ApiError(
                404,
                "Deleted employee not found."
            );
        }

        await transaction.commit();

        return sanitizeEmployee(
            employee
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }
};

/* ========================= Force Delete Employee ========================= */

const forceDeleteEmployee = async (
    uuid
) => {
    /* ========================= Find Deleted Employee ========================= */

    const employee =
        await adminEmployeeRepository.findDeletedByUuid(
            uuid
        );

    if (!employee) {
        throw new ApiError(
            404,
            "Employee not found."
        );
    }

    /* ========================= Check Soft Delete ========================= */

    if (!employee.deleted_at) {
        throw new ApiError(
            400,
            "Employee must be soft deleted before force delete."
        );
    }

    const profileImage =
        employee.profile_image;

    const transaction =
        await sequelize.transaction();

    try {
        /* ========================= Delete Employee + User ========================= */

        await adminEmployeeRepository.forceDeleteEmployee(
            employee,
            transaction
        );

        await transaction.commit();

        /* ========================= Delete Cloudinary Image ========================= */

        if (profileImage) {
            try {
                await deleteCloudinaryFile(
                    profileImage,
                    "image"
                );
            } catch (error) {
                logger.error(
                    `Failed to delete employee profile image: ${error.message}`
                );
            }
        }
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);

        throw error;
    }

    return true;
};

/* ========================= Get Trash Employees ========================= */

const getTrashEmployees = async (
    query
) => {
    const result =
        await adminEmployeeRepository.getTrashEmployees(
            query
        );

    result.rows =
        result.rows.map(
            (employee) =>
                sanitizeEmployee(
                    employee
                )
        );

    return result;
};

/* ========================= Exports ========================= */

module.exports = {
    createEmployee,
    updateEmployee,
    getEmployee,
    getEmployees,
    updateEmployeeStatus,
    deleteEmployee,
    restoreEmployee,
    forceDeleteEmployee,
    getTrashEmployees,
};