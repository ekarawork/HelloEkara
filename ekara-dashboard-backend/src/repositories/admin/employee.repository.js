"use strict";

const { Op } = require("sequelize");

const {
    employee,
    user,
} = require("../../database/models");

/* ========================= Employee ========================= */

// Create employee
const createEmployee = async (
    payload,
    transaction
) => {
    return await employee.create(
        payload,
        {
            transaction,
        }
    );
};

// Find employee by ID
const findById = async (
    id,
    options = {}
) => {
    return await employee.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find employee by UUID
const findByUuid = async (
    uuid,
    options = {}
) => {
    return await employee.findOne({
        where: { uuid },
        ...options,
    });
};

// Find employee by email
const findByEmail = async (
    email,
    options = {}
) => {
    return await employee.findOne({
        where: { email },
        ...options,
    });
};

// Find employee by employee code
const findByEmployeeCode = async (
    employee_code,
    options = {}
) => {
    return await employee.findOne({
        where: { employee_code },
        ...options,
    });
};

// Find employee by user ID
const findByUserId = async (
    userId,
    options = {}
) => {
    return await employee.findOne({
        where: {
            user_id: userId,
        },
        ...options,
    });
};

// Update employee
const updateEmployee = async (
    employeeData,
    payload,
    transaction
) => {
    return await employeeData.update(
        payload,
        {
            transaction,
        }
    );
};

/* ========================= User / Login ========================= */

// Find user by ID
const findUserById = async (
    id,
    options = {}
) => {
    return await user.findByPk(
        id,
        {
            ...options,
        }
    );
};

// Find user by email
const findUserByEmail = async (
    email,
    options = {}
) => {
    return await user.findOne({
        where: {
            email,
        },
        ...options,
    });
};

// Create login user
const createUser = async (
    payload,
    transaction
) => {
    return await user.create(
        payload,
        {
            transaction,
        }
    );
};

// Update login user
const updateUser = async (
    userData,
    payload,
    transaction
) => {
    return await userData.update(
        payload,
        {
            transaction,
        }
    );
};

// Delete login user
const deleteUser = async (
    userData,
    transaction
) => {
    return await userData.destroy({
        force: true,
        transaction,
    });
};

/* ========================= Employee Status ========================= */

// Update employee status
// Also sync linked users.status
const updateEmployeeStatus = async (
    uuid,
    status,
    userId,
    transaction
) => {
    const employeeData =
        await employee.findOne({
            where: {
                uuid,
            },
            transaction,
        });

    if (!employeeData) {
        return null;
    }

    // Update employee status
    await employeeData.update(
        {
            status,
            updated_by: userId,
        },
        {
            transaction,
        }
    );

    // Update linked login user status
    if (employeeData.user_id) {
        const loginUser =
            await user.findByPk(
                employeeData.user_id,
                {
                    transaction,
                }
            );

        if (loginUser) {
            await loginUser.update(
                {
                    status,
                },
                {
                    transaction,
                }
            );
        }
    }

    return employeeData;
};

/* ========================= Soft Delete ========================= */

// Soft delete employee
// Also deactivate linked login user
const deleteEmployee = async (
    employeeData,
    transaction
) => {
    const linkedUserId =
        employeeData.user_id;

    // Soft delete employee
    const result =
        await employeeData.destroy({
            transaction,
        });

    // Disable linked login account
    if (linkedUserId) {
        const loginUser =
            await user.findByPk(
                linkedUserId,
                {
                    transaction,
                }
            );

        if (loginUser) {
            await loginUser.update(
                {
                    status: "INACTIVE",
                },
                {
                    transaction,
                }
            );
        }
    }

    return result;
};

/* ========================= Employee List ========================= */

const getEmployees = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
    department,
    designation,
    role,
    employment_type,
}) => {
    const offset =
        (page - 1) * limit;

    const where = {};

    /* ========================= Search ========================= */

    if (search) {
        where[Op.or] = [
            {
                first_name: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                last_name: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                email: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                employee_code: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                phone: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                department: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                designation: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    /* ========================= Filters ========================= */

    if (status) {
        where.status = status;
    }

    if (department) {
        where.department = department;
    }

    if (designation) {
        where.designation = designation;
    }

    if (role) {
        where.role = role;
    }

    if (employment_type) {
        where.employment_type =
            employment_type;
    }

    /* ========================= Query ========================= */

    const {
        count,
        rows,
    } = await employee.findAndCountAll({
        where,
        offset,
        limit,
        order: [
            ["createdAt", "DESC"],
            ["id", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(count / limit),
    };
};

/* ========================= Employee Details ========================= */

const getEmployeeDetails = async (
    uuid
) => {
    return await employee.findOne({
        where: {
            uuid,
        },
        include: [
            {
                model: user,
                as: "user",
                attributes: [
                    "id",
                    "uuid",
                    "email",
                    "role",
                    "status",
                    "last_login",
                ],
                required: false,
            },
        ],
    });
};

/* ========================= Restore / Force Delete ========================= */

// Find deleted employee
const findDeletedByUuid = async (
    uuid
) => {
    return await employee.findOne({
        where: {
            uuid,
        },
        paranoid: false,
    });
};

// Restore employee
// Also sync linked user status
const restoreEmployee = async (
    uuid,
    userId,
    transaction
) => {
    const employeeData =
        await employee.findOne({
            where: {
                uuid,
                deleted_at: {
                    [Op.ne]: null,
                },
            },
            paranoid: false,
            transaction,
        });

    if (!employeeData) {
        return null;
    }

    // Restore employee
    await employeeData.restore({
        transaction,
    });

    await employeeData.update(
        {
            updated_by: userId,
        },
        {
            transaction,
        }
    );

    // Sync linked login user status
    if (employeeData.user_id) {
        const loginUser =
            await user.findByPk(
                employeeData.user_id,
                {
                    transaction,
                }
            );

        if (loginUser) {
            await loginUser.update(
                {
                    status:
                        employeeData.status,
                },
                {
                    transaction,
                }
            );
        }
    }

    await employeeData.reload({
        transaction,
        paranoid: false,
    });

    return employeeData;
};

// Force delete employee
// Also permanently delete linked login user
const forceDeleteEmployee = async (
    employeeData,
    transaction
) => {
    const linkedUserId =
        employeeData.user_id;

    // Permanently delete employee
    await employeeData.destroy({
        force: true,
        transaction,
    });

    // Permanently delete linked login user
    if (linkedUserId) {
        const loginUser =
            await user.findByPk(
                linkedUserId,
                {
                    transaction,
                }
            );

        if (loginUser) {
            await loginUser.destroy({
                force: true,
                transaction,
            });
        }
    }

    return true;
};

/* ========================= Trash Employees ========================= */

const getTrashEmployees = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {
    const offset =
        (page - 1) * limit;

    const where = {
        deleted_at: {
            [Op.ne]: null,
        },
    };

    /* ========================= Search ========================= */

    if (search) {
        where[Op.or] = [
            {
                first_name: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                last_name: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                email: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                employee_code: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                phone: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                department: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                designation: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    /* ========================= Query ========================= */

    const {
        count,
        rows,
    } = await employee.findAndCountAll({
        where,
        paranoid: false,
        offset,
        limit,
        order: [
            ["deleted_at", "DESC"],
        ],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages:
            Math.ceil(count / limit),
    };
};

/* ========================= Exports ========================= */

module.exports = {
    // Employee
    createEmployee,
    findById,
    findByUuid,
    findByEmail,
    findByEmployeeCode,
    findByUserId,
    updateEmployee,
    updateEmployeeStatus,
    deleteEmployee,

    // User / Login
    findUserById,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,

    // Employee List
    getEmployees,

    // Employee Details
    getEmployeeDetails,

    // Restore / Delete
    findDeletedByUuid,
    restoreEmployee,
    forceDeleteEmployee,

    // Trash
    getTrashEmployees,
};