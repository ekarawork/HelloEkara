const { Op } = require("sequelize");
const {
    client,
    client_service,
    client_performance_daily,
    user,
} = require("../../database/models");

/* ========================= Client Performance ========================= */

// Create daily performance
const createPerformance = async (payload, transaction) => {
    return await client_performance_daily.create(payload, {
        transaction,
    });
};

// Find performance by ID
const findById = async (id, options = {}) => {
    return await client_performance_daily.findByPk(id, {
        ...options,
    });
};

// Find performance by UUID
const findByUuid = async (uuid, options = {}) => {
    return await client_performance_daily.findOne({
        where: { uuid },
        ...options,
    });
};

// Find performance by client service and date
const findByServiceAndDate = async (
    clientServiceId,
    performanceDate,
    options = {}
) => {
    return await client_performance_daily.findOne({
        where: {
            client_service_id: clientServiceId,
            performance_date: performanceDate,
        },
        ...options,
    });
};

// Find performance by client, service and date
const findByClientServiceDate = async (
    clientId,
    clientServiceId,
    performanceDate,
    options = {}
) => {
    return await client_performance_daily.findOne({
        where: {
            client_id: clientId,
            client_service_id: clientServiceId,
            performance_date: performanceDate,
        },
        ...options,
    });
};

// Update performance
const updatePerformance = async (
    performanceData,
    payload,
    transaction
) => {
    return await performanceData.update(payload, {
        transaction,
    });
};

// Soft delete performance
const deletePerformance = async (
    performanceData,
    transaction
) => {
    return await performanceData.destroy({
        transaction,
    });
};

/* ========================= Performance List ========================= */

// Get performance records
const getPerformances = async ({
    page = 1,
    limit = 10,
    clientId,
    clientServiceId,
    serviceName,
    startDate,
    endDate,
}) => {
    const offset = (page - 1) * limit;

    const where = {};

    if (clientId) {
        where.client_id = clientId;
    }

    if (clientServiceId) {
        where.client_service_id = clientServiceId;
    }

    if (startDate && endDate) {
        where.performance_date = {
            [Op.between]: [startDate, endDate],
        };
    } else if (startDate) {
        where.performance_date = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        where.performance_date = {
            [Op.lte]: endDate,
        };
    }

    const serviceWhere = {};

    if (serviceName) {
        serviceWhere.service_name = serviceName;
    }

    const { count, rows } =
        await client_performance_daily.findAndCountAll({
            where,

            include: [
                {
                    model: client,
                    as: "client",
                    required: false,
                    attributes: [
                        "id",
                        "uuid",
                        "name",
                    ],
                },
                {
                    model: client_service,
                    as: "clientService",
                    required: !!serviceName,
                    where: serviceWhere,
                    attributes: [
                        "id",
                        "uuid",
                        "client_id",
                        "service_name",
                        "monthly_budget",
                    ],
                },
                {
                    model: user,
                    as: "createdBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },
                {
                    model: user,
                    as: "updatedBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },
            ],

            offset,
            limit,

            order: [
                ["performance_date", "DESC"],
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

/* ========================= Client Performance ========================= */

// Get all performance records for a client
const getClientPerformances = async (
    clientId,
    {
        startDate,
        endDate,
        clientServiceId,
        serviceName,
    } = {}
) => {
    const where = {
        client_id: clientId,
    };

    if (clientServiceId) {
        where.client_service_id = clientServiceId;
    }

    if (startDate && endDate) {
        where.performance_date = {
            [Op.between]: [startDate, endDate],
        };
    } else if (startDate) {
        where.performance_date = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        where.performance_date = {
            [Op.lte]: endDate,
        };
    }

    const serviceWhere = {};

    if (serviceName) {
        serviceWhere.service_name = serviceName;
    }

    return await client_performance_daily.findAll({
        where,

        include: [
            {
                model: client_service,
                as: "clientService",
                required: !!serviceName,
                where: serviceWhere,
                attributes: [
                    "id",
                    "uuid",
                    "service_name",
                    "monthly_budget",
                ],
            },
        ],

        order: [
            ["performance_date", "ASC"],
            ["id", "ASC"],
        ],
    });
};

/* ========================= Dashboard Data ========================= */

// Get performance records between dates
/* ========================= Dashboard Data ========================= */

// Get performance dashboard data
const getDashboardPerformance = async ({
    startDate,
    endDate,
    serviceName,
}) => {
    const where = {};

    /* ========================= Date Filter ========================= */

    if (startDate && endDate) {
        where.performance_date = {
            [Op.between]: [startDate, endDate],
        };
    } else if (startDate) {
        where.performance_date = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        where.performance_date = {
            [Op.lte]: endDate,
        };
    }

    /* ========================= Service Filter ========================= */

    const serviceWhere = {};

    if (serviceName) {
        serviceWhere.service_name = serviceName;
    }

    /* ========================= Total Stats ========================= */

    const summary =
        await client_performance_daily.findOne({
            where,

            attributes: [
                [
                    require("sequelize").fn(
                        "COALESCE",
                        require("sequelize").fn(
                            "SUM",
                            require("sequelize").col(
                                "daily_spend"
                            )
                        ),
                        0
                    ),
                    "totalSpend",
                ],
                [
                    require("sequelize").fn(
                        "COALESCE",
                        require("sequelize").fn(
                            "SUM",
                            require("sequelize").col(
                                "impressions"
                            )
                        ),
                        0
                    ),
                    "totalImpressions",
                ],
                [
                    require("sequelize").fn(
                        "COALESCE",
                        require("sequelize").fn(
                            "SUM",
                            require("sequelize").col(
                                "clicks"
                            )
                        ),
                        0
                    ),
                    "totalClicks",
                ],
                [
                    require("sequelize").fn(
                        "COALESCE",
                        require("sequelize").fn(
                            "SUM",
                            require("sequelize").col(
                                "leads"
                            )
                        ),
                        0
                    ),
                    "totalLeads",
                ],
            ],

            include: serviceName
                ? [
                      {
                          model: client_service,
                          as: "clientService",
                          required: true,
                          where: serviceWhere,
                          attributes: [],
                      },
                  ]
                : [],
                // IMPORTANT
        raw: true,
        });

    /* ========================= Daily Leads ========================= */

    const dailyLeads =
        await client_performance_daily.findAll({
            where,

            attributes: [
                "performance_date",
                [
                    require("sequelize").fn(
                        "SUM",
                        require("sequelize").col(
                            "leads"
                        )
                    ),
                    "leads",
                ],
            ],

            include: serviceName
                ? [
                      {
                          model: client_service,
                          as: "clientService",
                          required: true,
                          where: serviceWhere,
                          attributes: [],
                      },
                  ]
                : [],

            group: ["performance_date"],

            order: [
                ["performance_date", "ASC"],
            ],

            raw: true,
        });

    return {
        summary,
        dailyLeads,
    };
};

/* ========================= Trash / Restore ========================= */

// Find deleted performance
const findDeletedByUuid = async (uuid) => {
    return await client_performance_daily.findOne({
        where: { uuid },
        paranoid: false,
    });
};

// Restore performance
const restorePerformance = async (
    uuid,
    userId,
    transaction
) => {
    const performanceData =
        await client_performance_daily.findOne({
            where: {
                uuid,
                deleted_at: {
                    [Op.ne]: null,
                },
            },
            paranoid: false,
            transaction,
        });

    if (!performanceData) {
        return null;
    }

    await performanceData.restore({
        transaction,
    });

    await performanceData.update(
        {
            updated_by: userId,
        },
        {
            transaction,
        }
    );

    await performanceData.reload({
        transaction,
        paranoid: false,
    });

    return performanceData;
};

// Force delete performance
const forceDeletePerformance = async (
    performanceData,
    transaction
) => {
    await performanceData.destroy({
        force: true,
        transaction,
    });

    return true;
};

// Get trash performance records
const getTrashPerformances = async ({
    page = 1,
    limit = 10,
    search = "",
    clientId,
    clientServiceId,
    serviceName,
}) => {
    const offset = (page - 1) * limit;

    const where = {
        deleted_at: {
            [Op.ne]: null,
        },
    };

    if (clientId) {
        where.client_id = clientId;
    }

    if (clientServiceId) {
        where.client_service_id = clientServiceId;
    }

    if (search) {
        where[Op.or] = [
            {
                performance_date: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    const serviceWhere = {};

    if (serviceName) {
        serviceWhere.service_name = serviceName;
    }

    const { count, rows } =
        await client_performance_daily.findAndCountAll({
            where,
            paranoid: false,

            include: [
                {
                    model: client,
                    as: "client",
                    required: false,
                    attributes: [
                        "id",
                        "uuid",
                        "name",
                    ],
                },
                {
                    model: client_service,
                    as: "clientService",
                    required: !!serviceName,
                    where: serviceWhere,
                    attributes: [
                        "id",
                        "uuid",
                        "client_id",
                        "service_name",
                        "monthly_budget",
                    ],
                },
                {
                    model: user,
                    as: "createdBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },
                {
                    model: user,
                    as: "updatedBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },
            ],

            offset,
            limit,

            order: [
                ["deleted_at", "DESC"],
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

/* ========================= All Performance List ========================= */

// Get all performance records
const getAllPerformances = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        serviceName,
    } = query;

    const offset = (page - 1) * limit;

    /* ========================= Performance Filter ========================= */

    const where = {};

    /* ========================= Client Search ========================= */

    const clientWhere = {};

    if (search?.trim()) {
        clientWhere.name = {
            [Op.like]: `%${search.trim()}%`,
        };
    }

    /* ========================= Client Service Filter ========================= */

    const clientServiceWhere = {};

    if (serviceName) {
        clientServiceWhere.service_name = serviceName;
    }

    /* ========================= Query ========================= */

    const { count, rows } =
        await client_performance_daily.findAndCountAll({
            where,

            include: [
                /* ========================= Client ========================= */

                {
                    model: client,
                    as: "client",
                    required: Boolean(search?.trim()),
                    where: clientWhere,
                    attributes: [
                        "id",
                        "uuid",
                        "name",
                    ],
                },

                /* ========================= Client Service ========================= */

                {
                    model: client_service,
                    as: "clientService",
                    required: Boolean(serviceName),
                    where: clientServiceWhere,
                    attributes: [
                        "id",
                        "uuid",
                        "client_id",
                        "service_name",
                        "monthly_budget",
                    ],
                },

                /* ========================= Created By ========================= */

                {
                    model: user,
                    as: "createdBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },

                /* ========================= Updated By ========================= */

                {
                    model: user,
                    as: "updatedBy",
                    required: false,
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                    ],
                },
            ],

            offset: Number(offset),
            limit: Number(limit),

            order: [
                ["performance_date", "DESC"],
                ["id", "DESC"],
            ],
        });

    return {
        count,
        rows,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(
            count / Number(limit)
        ),
    };
};

/* ========================= Exports ========================= */

module.exports = {
    // Performance
    createPerformance,
    findById,
    findByUuid,
    findByServiceAndDate,
    findByClientServiceDate,
    updatePerformance,
    deletePerformance,

    // List
    getPerformances,

    // Client Performance
    getClientPerformances,

    // Dashboard
    getDashboardPerformance,

    // Restore / Delete
    findDeletedByUuid,
    restorePerformance,
    forceDeletePerformance,
    getTrashPerformances,
    getAllPerformances
};