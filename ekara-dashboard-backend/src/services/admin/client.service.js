const bcrypt = require("bcryptjs");
const { adminClientRepository } = require("../../repositories/index");
const {
    uploadToCloudinary,
    deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");
const ApiError = require("../../utils/ApiError");
const { sequelize, user } = require("../../database/models");
const logger = require("../../utils/winston.util");

// Helper: delete uploaded Cloudinary files
const deleteUploadedFiles = async (files = []) => {
    for (const file of files) {
        try {
            await deleteCloudinaryFile(file.url, file.resourceType);
        } catch (error) {
            logger.error(`Failed to delete Cloudinary file: ${error.message}`);
        }
    }
};

// Create client
const createClient = async (payload, files, userId) => {
    const transaction = await sequelize.transaction();
    const uploadedFiles = [];

    try {
        const emailExists = await adminClientRepository.findByEmail(payload.email);
        if (emailExists) {
            throw new ApiError(409, "Client email already exists.");
        }

        const loginIdExists = await adminClientRepository.findByLoginId(payload.login_id);
        if (loginIdExists) {
            throw new ApiError(409, "Client login ID already exists.");
        }

        const hashedPassword = await bcrypt.hash(payload.password, 12);

        // Create login user
        const loginUser = await user.create(
            {
                first_name: payload.name,
                last_name: null,
                email: payload.email,
                password: hashedPassword,
                role: "CLIENT",
                status: "ACTIVE",
            },
            { transaction }
        );

        let profilePhoto = null;
        if (files && files.profile_photo && files.profile_photo[0]) {
            const profilePhotoFile = files.profile_photo[0];
            const result = await uploadToCloudinary(profilePhotoFile, {
                folder: `${process.env.CLOUDINARY_BASE_FOLDER}/clients/profile`,
                resourceType: "image",
            });
            profilePhoto = result.secure_url;
            uploadedFiles.push(profilePhoto);
        }

        let agreementContract = null;
        if (files && files.agreement_contract && files.agreement_contract[0]) {
            const agreementContractFile = files.agreement_contract[0];
            const result = await uploadToCloudinary(agreementContractFile, {
                folder: `${process.env.CLOUDINARY_BASE_FOLDER}/clients/contracts`,
                resourceType: "raw",
            });
            agreementContract = result.secure_url;
            uploadedFiles.push(agreementContract);
        }

        const client = await adminClientRepository.createClient(
            {
                ...payload,
                user_id: loginUser.id,
                password: hashedPassword,
                profile_photo: profilePhoto,
                agreement_contract: agreementContract,
                created_by: userId,
                updated_by: userId,
            },
            transaction
        );

        let clientServices = [];
        if (payload.services && Array.isArray(payload.services) && payload.services.length > 0) {
            const servicePayload = payload.services.map((item) => ({
                client_id: client.id,
                service_name: item.service_name,
                monthly_budget: item.monthly_budget || 0,
            }));

            clientServices = await adminClientRepository.createClientServices(
                servicePayload,
                transaction
            );
        }

        await transaction.commit();

        const createdClient = await adminClientRepository.getClientDetails(client.uuid);

        return {
            ...createdClient.toJSON(),
            password: undefined,
            clientServices: createdClient.clientServices || [],
        };
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (uploadedFiles.length > 0) {
            await deleteUploadedFiles(uploadedFiles);
        }

        logger.error(error);
        throw error;
    }
};

// Update client
const updateClient = async (uuid, payload, files, userId) => {
    const transaction = await sequelize.transaction();
    const uploadedFiles = [];

    try {
        const client = await adminClientRepository.findByUuid(uuid, { transaction });
        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        // Get linked login user
        const loginUser = await user.findByPk(client.user_id, { transaction });
        if (!loginUser) {
            throw new ApiError(404, "Client login user not found.");
        }

        if (payload.email && payload.email !== client.email) {
            const emailExists = await adminClientRepository.findByEmail(payload.email);
            if (emailExists && emailExists.id !== client.id) {
                throw new ApiError(409, "Client email already exists.");
            }
        }

        if (payload.login_id && payload.login_id !== client.login_id) {
            const loginIdExists = await adminClientRepository.findByLoginId(payload.login_id);
            if (loginIdExists && loginIdExists.id !== client.id) {
                throw new ApiError(409, "Client login ID already exists.");
            }
        }

        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 12);
        } else {
            delete payload.password;
        }

        // Update login user
        const userPayload = {};

        // Sync email
        if (payload.email && payload.email !== client.email) {
            userPayload.email = payload.email;
        }

        // Sync name
        if (payload.name && payload.name !== client.name) {
            userPayload.first_name = payload.name;
        }

        // Sync password
        if (payload.password) {
            userPayload.password = payload.password;
        }

        // Sync status
        if (payload.status) {
            userPayload.status = payload.status;
        }

        // Update linked user
        if (Object.keys(userPayload).length > 0) {
            await loginUser.update(userPayload, { transaction });
        }

        const oldProfilePhoto = client.profile_photo;
        const oldAgreementContract = client.agreement_contract;

        // New profile photo
        if (files && files.profile_photo && files.profile_photo[0]) {
            const profilePhotoFile = files.profile_photo[0];
            const result = await uploadToCloudinary(profilePhotoFile, {
                folder: `${process.env.CLOUDINARY_BASE_FOLDER}/clients/profile`,
                resourceType: "image",
            });
            payload.profile_photo = result.secure_url;
            uploadedFiles.push(result.secure_url);
        }

        // New agreement contract
        if (files && files.agreement_contract && files.agreement_contract[0]) {
            const agreementContractFile = files.agreement_contract[0];
            const result = await uploadToCloudinary(agreementContractFile, {
                folder: `${process.env.CLOUDINARY_BASE_FOLDER}/clients/contracts`,
                resourceType: "raw",
            });
            payload.agreement_contract = result.secure_url;
            uploadedFiles.push(result.secure_url);
        }

        payload.updated_by = userId;

        // Update client
        await adminClientRepository.updateClient(client, payload, transaction);

        if (payload.services && Array.isArray(payload.services)) {
            await adminClientRepository.deleteClientServices(client.id, transaction);

            if (payload.services.length > 0) {
                const servicePayload = payload.services.map((item) => ({
                    client_id: client.id,
                    service_name: item.service_name,
                    monthly_budget: item.monthly_budget || 0,
                }));

                await adminClientRepository.createClientServices(
                    servicePayload,
                    transaction
                );
            }

            delete payload.services;
        }

        await transaction.commit();

        if (files && files.profile_photo && files.profile_photo[0] && oldProfilePhoto) {
            await deleteCloudinaryFile(oldProfilePhoto, "image");
        }

        if (files && files.agreement_contract && files.agreement_contract[0] && oldAgreementContract) {
            await deleteCloudinaryFile(oldAgreementContract, "raw");
        }

        const updatedClient = await adminClientRepository.getClientDetails(uuid);

        return {
            ...updatedClient.toJSON(),
            password: undefined,
            clientServices: updatedClient.clientServices || [],
        };
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (uploadedFiles.length > 0) {
            await deleteUploadedFiles(uploadedFiles);
        }

        logger.error(error);
        throw error;
    }
};

// Get client
const getClient = async (uuid) => {
    const client = await adminClientRepository.getClientDetails(uuid);

    if (!client) {
        throw new ApiError(404, "Client not found.");
    }

    const data = client.toJSON();
    delete data.password;

    return {
        ...data,
        clientServices: data.clientServices || [],
    };
};

// Get clients
const getClients = async (query) => {
    const result = await adminClientRepository.getClients(query);

    result.rows = result.rows.map((client) => {
        const data = client.toJSON();
        delete data.password;
        return data;
    });

    return result;
};

// Update client status
const updateClientStatus = async (uuid, status, userId) => {
    const transaction = await sequelize.transaction();

    try {
        const client = await adminClientRepository.updateClientStatus(
            uuid,
            status,
            userId,
            transaction
        );

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        await transaction.commit();

        const data = client.toJSON();
        delete data.password;
        return data;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

// Delete client (soft)
const deleteClient = async (uuid) => {
    const transaction = await sequelize.transaction();

    try {
        const client = await adminClientRepository.findByUuid(uuid, { transaction });

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        await adminClientRepository.deleteClient(client, transaction);
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

// Restore client
const restoreClient = async (uuid, userId) => {
    const transaction = await sequelize.transaction();

    try {
        const client = await adminClientRepository.restoreClient(
            uuid,
            userId,
            transaction
        );

        if (!client) {
            throw new ApiError(404, "Deleted client not found.");
        }

        await transaction.commit();

        const data = client.toJSON();
        delete data.password;
        return data;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

// Force delete client
const forceDeleteClient = async (uuid) => {
    const client = await adminClientRepository.findDeletedByUuid(uuid);

    if (!client) {
        throw new ApiError(404, "Client not found.");
    }

    if (!client.deleted_at) {
        throw new ApiError(400, "Client must be soft deleted before force delete.");
    }

    const profilePhoto = client.profile_photo;
    const agreementContract = client.agreement_contract;

    const transaction = await sequelize.transaction();

    try {
        await adminClientRepository.forceDeleteClient(client, transaction);
        await transaction.commit();

        if (profilePhoto) {
            await deleteCloudinaryFile(profilePhoto, "image");
        }

        if (agreementContract) {
            await deleteCloudinaryFile(agreementContract, "raw");
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

// Get trash clients
const getTrashClients = async (query) => {
    const result = await adminClientRepository.getTrashClients(query);

    result.rows = result.rows.map((client) => {
        const data = client.toJSON();
        delete data.password;
        return data;
    });

    return result;
};

// Get client agreement contract
const getClientAgreement = async (uuid) => {
    const client = await adminClientRepository.findByUuid(uuid);

    if (!client) {
        throw new ApiError(404, "Client not found.");
    }

    if (!client.agreement_contract) {
        throw new ApiError(404, "Agreement contract not found.");
    }

    return client.agreement_contract;
};

module.exports = {
    createClient,
    updateClient,
    getClient,
    getClients,
    updateClientStatus,
    deleteClient,
    restoreClient,
    forceDeleteClient,
    getTrashClients,
    getClientAgreement,
};