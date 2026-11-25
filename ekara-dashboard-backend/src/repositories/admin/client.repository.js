const { Op } = require("sequelize");
const { client, client_service, user } = require("../../database/models");

/* ========================= Client ========================= */

// Create client
const createClient = async (payload, transaction) => {
    return await client.create(payload, { transaction });
};

// Find client by ID
const findById = async (id) => {
    return await client.findByPk(id);
};

// Find client by UUID
const findByUuid = async (uuid, options = {}) => {
    return await client.findOne({
        where: { uuid },
        ...options,
    });
};

// Find client by email
const findByEmail = async (email, options = {}) => {
    return await client.findOne({
        where: { email },
        ...options,
    });
};

// Find client by login ID
const findByLoginId = async (login_id, options = {}) => {
    return await client.findOne({
        where: { login_id },
        ...options,
    });
};

// Update client
const updateClient = async (clientData, payload, transaction) => {
    return await clientData.update(payload, { transaction });
};

// Update client status
const updateClientStatus = async (uuid, status, userId, transaction) => {
    const clientData = await client.findOne({
        where: { uuid },
        transaction,
    });

    if (!clientData) {
        return null;
    }

    // Update client status
    await clientData.update(
        {
            status,
            updated_by: userId,
        },
        { transaction }
    );

    // Update linked user
    if (clientData.user_id) {
        const loginUser = await user.findByPk(clientData.user_id, {
            transaction,
        });

        if (loginUser) {
            await loginUser.update(
                {
                    status,
                    first_name: clientData.name,
                },
                { transaction }
            );
        }
    }

    return clientData;
};

// Soft delete client
const deleteClient = async (clientData, transaction) => {
    return await clientData.destroy({ transaction });
};

/* ========================= Client List ========================= */

const getClients = async ({ page = 1, limit = 10, search = "", status }) => {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { login_id: { [Op.like]: `%${search}%` } },
        ];
    }

    if (status) {
        where.status = status;
    }

    const { count, rows } = await client.findAndCountAll({
        where,
        include: [
            {
                model: client_service,
                as: "clientServices",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "client_id",
                    "service_name",
                    "monthly_budget",
                    "createdAt",
                    "updatedAt",
                ],
            },
        ],
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
        totalPages: Math.ceil(count / limit),
    };
};

/* ========================= Client Details ========================= */

const getClientDetails = async (uuid) => {
    return await client.findOne({
        where: { uuid },
        include: [
            {
                model: client_service,
                as: "clientServices",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "client_id",
                    "service_name",
                    "monthly_budget",
                    "createdAt",
                    "updatedAt",
                ],
            },
        ],
    });
};

/* ========================= Client Services ========================= */

// Create client service
const createClientService = async (payload, transaction) => {
    return await client_service.create(payload, { transaction });
};

// Create multiple client services
const createClientServices = async (payload, transaction) => {
    return await client_service.bulkCreate(payload, { transaction });
};

// Find client service
const findClientService = async (clientId, serviceName, transaction) => {
    return await client_service.findOne({
        where: {
            client_id: clientId,
            service_name: serviceName,
        },
        transaction,
    });
};

// Get client services
const getClientServices = async (clientId, transaction) => {
    return await client_service.findAll({
        where: { client_id: clientId },
        transaction,
        order: [["id", "ASC"]],
    });
};

// Update client service
const updateClientService = async (clientService, payload, transaction) => {
    return await clientService.update(payload, { transaction });
};

// Delete all client services
const deleteClientServices = async (clientId, transaction) => {
    return await client_service.destroy({
        where: { client_id: clientId },
        transaction,
    });
};

/* ========================= Restore / Force Delete ========================= */

// Find deleted client
const findDeletedByUuid = async (uuid) => {
    return await client.findOne({
        where: { uuid },
        paranoid: false,
    });
};

// Restore client
const restoreClient = async (uuid, userId, transaction) => {
    const clientData = await client.findOne({
        where: {
            uuid,
            deleted_at: { [Op.ne]: null },
        },
        paranoid: false,
        transaction,
    });

    if (!clientData) {
        return null;
    }

    await clientData.restore({ transaction });

    await clientData.update({ updated_by: userId }, { transaction });

    await clientData.reload({ transaction, paranoid: false });

    return clientData;
};

// Force delete client
const forceDeleteClient = async (clientData, transaction) => {
    const linkedUserId = clientData.user_id;

    // Permanently delete client
    await clientData.destroy({ force: true, transaction });

    // Permanently delete linked login user
    if (linkedUserId) {
        const loginUser = await user.findByPk(linkedUserId, { transaction });

        if (loginUser) {
            await loginUser.destroy({ force: true, transaction });
        }
    }

    return true;
};

/* ========================= Trash Clients ========================= */

const getTrashClients = async ({ page = 1, limit = 10, search = "" }) => {
    const offset = (page - 1) * limit;

    const where = {
        deleted_at: { [Op.ne]: null },
    };

    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { login_id: { [Op.like]: `%${search}%` } },
        ];
    }

    const { count, rows } = await client.findAndCountAll({
        where,
        paranoid: false,
        offset,
        limit,
        order: [["deleted_at", "DESC"]],
    });

    return {
        count,
        rows,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
    };
};

// Find client by User ID
const findByUserId = async (userId, options = {}) => {
    return await client.findOne({
        where: { user_id: userId },
        ...options,
    });
};

module.exports = {
    // Client
    createClient,
    findById,
    findByUuid,
    findByEmail,
    findByLoginId,
    updateClient,
    updateClientStatus,
    deleteClient,
    getClients,
    getClientDetails,

    // Client Services
    createClientService,
    createClientServices,
    findClientService,
    getClientServices,
    updateClientService,
    deleteClientServices,

    // Restore / Delete
    findDeletedByUuid,
    restoreClient,
    forceDeleteClient,

    // Trash
    getTrashClients,
    findByUserId,
};