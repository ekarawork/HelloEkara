const { adminClientRepository, adminClientPerformanceRepository } = require("../../repositories/index");
const { sequelize } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= Create Performance ========================= */

// Create daily performance
const createPerformance = async (payload, userId) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            client_id,
            client_service_id,
            performance_date,
            daily_spend = 0,
            impressions = 0,
            clicks = 0,
            leads = 0,
        } = payload;

        /* ========================= Validate Client ========================= */

        const client = await adminClientRepository.findById(client_id);

        if (!client) {
            throw new ApiError(404, "Client not found.");
        }

        /* ========================= Validate Client Service ========================= */

        const clientServices =
            await adminClientRepository.getClientServices(
                client_id,
                transaction
            );

        const clientService = clientServices.find(
            (service) =>
                Number(service.id) === Number(client_service_id)
        );

        if (!clientService) {
            throw new ApiError(
                400,
                "Selected service is not assigned to this client."
            );
        }

        /* ========================= Duplicate Check ========================= */

        const existingPerformance =
            await adminClientPerformanceRepository.findByServiceAndDate(
                client_service_id,
                performance_date,
                {
                    transaction,
                }
            );

        if (existingPerformance) {
            throw new ApiError(
                409,
                "Performance data already exists for this service and date."
            );
        }

        /* ========================= Create Performance ========================= */

        const performance =
            await adminClientPerformanceRepository.createPerformance(
                {
                    client_id,
                    client_service_id,
                    performance_date,
                    daily_spend,
                    impressions,
                    clicks,
                    leads,
                    edit_count: 0,
                    created_by: userId,
                    updated_by: userId,
                },
                transaction
            );

        await transaction.commit();

        return performance;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* ========================= Get Performance ========================= */

// Get single performance
const getPerformance = async (uuid) => {
    const performance =
        await adminClientPerformanceRepository.findByUuid(uuid, {
            include: [
                {
                    association: "client",
                    attributes: [
                        "id",
                        "uuid",
                        "name",
                    ],
                },
                {
                    association: "clientService",
                    attributes: [
                        "id",
                        "uuid",
                        "service_name",
                        "monthly_budget",
                    ],
                },
            ],
        });

    if (!performance) {
        throw new ApiError(404, "Performance data not found.");
    }

    return performance;
};

/* ========================= Get Performance List ========================= */

// Get performance list
const getPerformances = async (query) => {
    return await adminClientPerformanceRepository.getPerformances(query);
};

/* ========================= Update Performance ========================= */

// Update daily performance
const updatePerformance = async (
    uuid,
    payload,
    userId
) => {
    const transaction = await sequelize.transaction();

    try {
        /* ========================= Find Performance ========================= */

        const performance =
            await adminClientPerformanceRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!performance) {
            throw new ApiError(
                404,
                "Performance data not found."
            );
        }

        /* ========================= Edit Limit ========================= */

        if (performance.edit_count >= 2) {
            throw new ApiError(
                400,
                "This performance record has reached the maximum edit limit."
            );
        }

        /* ========================= Resolve Values ========================= */

        const clientId =
            payload.client_id || performance.client_id;

        const clientServiceId =
            payload.client_service_id ||
            performance.client_service_id;

        const performanceDate =
            payload.performance_date ||
            performance.performance_date;

        /* ========================= Validate Client ========================= */

        const client = await adminClientRepository.findById(
            clientId
        );

        if (!client) {
            throw new ApiError(
                404,
                "Client not found."
            );
        }

        /* ========================= Validate Client Service ========================= */

        const clientServices =
            await adminClientRepository.getClientServices(
                clientId,
                transaction
            );

        const clientService = clientServices.find(
            (service) =>
                Number(service.id) ===
                Number(clientServiceId)
        );

        if (!clientService) {
            throw new ApiError(
                400,
                "Selected service is not assigned to this client."
            );
        }

        /* ========================= Duplicate Check ========================= */

        const duplicate =
            await adminClientPerformanceRepository.findByServiceAndDate(
                clientServiceId,
                performanceDate,
                {
                    transaction,
                }
            );

        if (
            duplicate &&
            Number(duplicate.id) !==
                Number(performance.id)
        ) {
            throw new ApiError(
                409,
                "Performance data already exists for this service and date."
            );
        }

        /* ========================= Prepare Update ========================= */

        const updatePayload = {
            client_id: clientId,
            client_service_id: clientServiceId,
            performance_date: performanceDate,
            updated_by: userId,
            edit_count: performance.edit_count + 1,
        };

        if (payload.daily_spend !== undefined) {
            updatePayload.daily_spend =
                payload.daily_spend;
        }

        if (payload.impressions !== undefined) {
            updatePayload.impressions =
                payload.impressions;
        }

        if (payload.clicks !== undefined) {
            updatePayload.clicks =
                payload.clicks;
        }

        if (payload.leads !== undefined) {
            updatePayload.leads =
                payload.leads;
        }

        /* ========================= Update ========================= */

        await adminClientPerformanceRepository.updatePerformance(
            performance,
            updatePayload,
            transaction
        );

        await transaction.commit();

        /* ========================= Return Updated Data ========================= */

        return await adminClientPerformanceRepository.findByUuid(
            uuid
        );
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* ========================= Delete Performance ========================= */

// Soft delete performance
const deletePerformance = async (
    uuid,
    userId
) => {
    const transaction = await sequelize.transaction();

    try {
        const performance =
            await adminClientPerformanceRepository.findByUuid(
                uuid,
                {
                    transaction,
                }
            );

        if (!performance) {
            throw new ApiError(
                404,
                "Performance data not found."
            );
        }

        await adminClientPerformanceRepository.updatePerformance(
            performance,
            {
                updated_by: userId,
            },
            transaction
        );

        await adminClientPerformanceRepository.deletePerformance(
            performance,
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

/* ========================= Client Performance ========================= */

// Get performance data for a particular client
const getClientPerformances = async (
    clientUuid,
    query = {}
) => {
    const client =
        await adminClientRepository.findByUuid(
            clientUuid
        );

    if (!client) {
        throw new ApiError(
            404,
            "Client not found."
        );
    }

    return await adminClientPerformanceRepository.getClientPerformances(
        client.id,
        query
    );
};

/* ========================= Dashboard Performance ========================= */

// Get dashboard performance data
/* ========================= Dashboard Performance ========================= */

// Get dashboard performance data
const getDashboardPerformance = async ({
    startDate,
    endDate,
    serviceName,
}) => {
    /* ========================= Date Validation ========================= */

    if (
        startDate &&
        endDate &&
        new Date(startDate) > new Date(endDate)
    ) {
        throw new ApiError(
            400,
            "Start date cannot be greater than end date."
        );
    }

    /* ========================= Get Dashboard Data ========================= */

    const dashboard =
        await adminClientPerformanceRepository.getDashboardPerformance(
            {
                startDate,
                endDate,
                serviceName,
            }
        );

    /* ========================= Summary ========================= */

    const summaryData =
        dashboard.summary?.toJSON?.() ||
        dashboard.summary ||
        {};

    const totalLeads = Number(
        summaryData.totalLeads || 0
    );

    const totalSpend = Number(
        summaryData.totalSpend || 0
    );

    const totalImpressions = Number(
        summaryData.totalImpressions || 0
    );

    const totalClicks = Number(
        summaryData.totalClicks || 0
    );

    /* ========================= Daily Leads ========================= */

    const dailyLeads = dashboard.dailyLeads.map(
        (item) => ({
            date: item.performance_date,
            leads: Number(item.leads || 0),
        })
    );

    /* ========================= Response ========================= */

    return {
        stats: {
            leads: totalLeads,
            spend: totalSpend,
            impressions: totalImpressions,
            clicks: totalClicks,
        },

        dailyLeads,
    };
};

/* ========================= Restore ========================= */

// Restore deleted performance
const restorePerformance = async (
    uuid,
    userId
) => {
    const transaction = await sequelize.transaction();

    try {
        const performance =
            await adminClientPerformanceRepository.restorePerformance(
                uuid,
                userId,
                transaction
            );

        if (!performance) {
            throw new ApiError(
                404,
                "Deleted performance data not found."
            );
        }

        await transaction.commit();

        return performance;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        logger.error(error);
        throw error;
    }
};

/* ========================= Force Delete ========================= */

// Permanently delete performance
const forceDeletePerformance = async (uuid) => {
    const performance =
        await adminClientPerformanceRepository.findDeletedByUuid(uuid);
    if (!performance) {
        throw new ApiError(
            404,
            "Performance data not found."
        );
    }
    if (!performance.deleted_at) {
        throw new ApiError(
            400,
            "Performance data must be soft deleted before force delete."
        );
    }
    const transaction = await sequelize.transaction();
    try {
        await adminClientPerformanceRepository.forceDeletePerformance(
            performance,
            transaction
        );
        await transaction.commit();
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }
        logger.error(error);
        throw error;
    }
    return true;
};

/* ========================= Trash Performance ========================= */

// Get deleted performance records
const getTrashPerformances = async (query) => {
    return await adminClientPerformanceRepository.getTrashPerformances(
        query
    );
};


/* ========================= All Performance List ========================= */

// Get all performance records
const getAllPerformances = async (query = {}) => {
    return await adminClientPerformanceRepository.getAllPerformances(
        query
    );
};

/* ========================= Exports ========================= */

module.exports = {
    createPerformance,
    getPerformance,
    getPerformances,
    updatePerformance,
    deletePerformance,
    getClientPerformances,
    getDashboardPerformance,
    restorePerformance,
    forceDeletePerformance,
    getTrashPerformances,
    getAllPerformances
};