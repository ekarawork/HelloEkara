const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminClientPerformanceService } = require("../../services/index");

const {
    createClientPerformanceSchema,
    updateClientPerformanceSchema,
} = require("../../validations/admin/clientPerformance.validation");

/* ========================= Create Performance ========================= */

// Create daily client performance
const createPerformance = asyncHandler(async (req, res) => {
    const { error, value } = createClientPerformanceSchema.validate(req.body, {
        abortEarly: true,
        convert: true,
    });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const performance = await adminClientPerformanceService.createPerformance(
        value,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client performance created successfully.",
        performance,
        201
    );
});

/* ========================= Get Performance List ========================= */

// Get client performance list
const getPerformances = asyncHandler(async (req, res) => {
    const performances = await adminClientPerformanceService.getPerformances({
        clientUuid: req.params.uuid,
        clientServiceUuid: req.query.clientServiceUuid,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        serviceName: req.query.serviceName,
    });

    return ResponseHelper.success(
        res,
        "Client performance fetched successfully.",
        performances
    );
});

/* ========================= Get Single Performance ========================= */

// Get single performance
const getPerformance = asyncHandler(async (req, res) => {
    const performance = await adminClientPerformanceService.getPerformance(
        req.params.performanceUuid
    );

    return ResponseHelper.success(
        res,
        "Client performance fetched successfully.",
        performance
    );
});

/* ========================= Update Performance ========================= */

// Update daily client performance
const updatePerformance = asyncHandler(async (req, res) => {
    const { error, value } = updateClientPerformanceSchema.validate(req.body, {
        abortEarly: true,
        convert: true,
    });

    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }

    const performance = await adminClientPerformanceService.updatePerformance(
        req.params.performanceUuid,
        value,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client performance updated successfully.",
        performance
    );
});

/* ========================= Delete Performance ========================= */

// Soft delete daily performance
const deletePerformance = asyncHandler(async (req, res) => {
    await adminClientPerformanceService.deletePerformance(
        req.params.performanceUuid,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client performance deleted successfully."
    );
});

/* ========================= Trash Performance ========================= */

// Get deleted performance list
const getTrashPerformances = asyncHandler(async (req, res) => {
    const performances =
        await adminClientPerformanceService.getTrashPerformances({
            clientUuid: req.params.uuid,
            clientServiceUuid: req.query.clientServiceUuid,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            serviceName: req.query.serviceName,
        });

    return ResponseHelper.success(
        res,
        "Trash client performance fetched successfully.",
        performances
    );
});

/* ========================= Restore Performance ========================= */

// Restore deleted performance
const restorePerformance = asyncHandler(async (req, res) => {
    const performance =
        await adminClientPerformanceService.restorePerformance(
            req.params.performanceUuid,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Client performance restored successfully.",
        performance
    );
});

/* ========================= Force Delete Performance ========================= */

// Permanently delete performance
const forceDeletePerformance = asyncHandler(async (req, res) => {
    const result =
        await adminClientPerformanceService.forceDeletePerformance(
            req.params.performanceUuid
        );

    return ResponseHelper.success(
        res,
        "Client performance permanently deleted.",
        result
    );
});

/* ========================= Performance Summary ========================= */

/* ========================= Performance Dashboard ========================= */

// Get performance dashboard
const getDashboardPerformance = asyncHandler(
    async (req, res) => {
        const dashboard =
            await adminClientPerformanceService.getDashboardPerformance(
                {
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    serviceName:
                        req.query.serviceName,
                }
            );

        return ResponseHelper.success(
            res,
            "Performance dashboard fetched successfully.",
            dashboard
        );
    }
);


/* ========================= All Performance List ========================= */

const getAllPerformances = async (req, res) => {
    try {
        const page = Math.max(
            parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.max(
            parseInt(req.query.limit, 10) || 10,
            1
        );

        const result =
            await adminClientPerformanceService.getAllPerformances({
                page,
                limit,
                search: req.query.search,
                serviceName: req.query.serviceName,
            });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Performance list fetched successfully.",
            data: result,
            errors: null,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(
            "Get All Performances Error:",
            error
        );

        return res.status(error.statusCode || 500).json({
            success: false,
            statusCode: error.statusCode || 500,
            message:
                error.message ||
                "Failed to fetch performance list.",
            data: null,
            errors: error.errors || null,
            timestamp: new Date().toISOString(),
        });
    }
};
/* ========================= Export ========================= */

module.exports = {
    createPerformance,
    getPerformances,
    getPerformance,
    updatePerformance,
    deletePerformance,

    // Trash / Restore / Force Delete
    getTrashPerformances,
    restorePerformance,
    forceDeletePerformance,
    getAllPerformances,

    // Summary
    getDashboardPerformance,
};