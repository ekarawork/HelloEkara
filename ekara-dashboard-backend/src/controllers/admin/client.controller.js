const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminClientService } = require("../../services/index");
const {
    createClientSchema,
    updateClientSchema,
} = require("../../validations/admin/client.validation");

// create client
const createClient = asyncHandler(async (req, res) => {
    if (req.body.services) {
        try {
            req.body.services =
                typeof req.body.services === "string"
                    ? JSON.parse(req.body.services)
                    : req.body.services;
        } catch (error) {
            return ResponseHelper.error(
                res,
                "Invalid services format.",
                null,
                422
            );
        }
    }

    const { error, value } = createClientSchema.validate(req.body, {
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

    // files
    const files = {
        profile_photo: req.files?.profile_photo || [],
        agreement_contract: req.files?.agreement_contract || [],
    };

    // create client
    const client = await adminClientService.createClient(
        value,
        files,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client created successfully.",
        client,
        201
    );
});

// get clients
const getClients = asyncHandler(async (req, res) => {
    const clients = await adminClientService.getClients({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search || "",
        status: req.query.status,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "DESC",
    });

    return ResponseHelper.success(
        res,
        "Clients fetched successfully.",
        clients
    );
});

// get client details
const getClient = asyncHandler(async (req, res) => {
    const client = await adminClientService.getClient(req.params.uuid);

    return ResponseHelper.success(
        res,
        "Client fetched successfully.",
        client
    );
});

// update client
const updateClient = asyncHandler(async (req, res) => {
    if (req.body.services) {
        try {
            req.body.services =
                typeof req.body.services === "string"
                    ? JSON.parse(req.body.services)
                    : req.body.services;
        } catch (error) {
            return ResponseHelper.error(
                res,
                "Invalid services format.",
                null,
                422
            );
        }
    }

    const { error, value } = updateClientSchema.validate(req.body, {
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

    // files
    const files = {
        profile_photo: req.files?.profile_photo || [],
        agreement_contract: req.files?.agreement_contract || [],
    };

    // update client
    const client = await adminClientService.updateClient(
        req.params.uuid,
        value,
        files,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client updated successfully.",
        client
    );
});

// update client status
const updateClientStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return ResponseHelper.error(
            res,
            "Status is required.",
            null,
            422
        );
    }

    const allowedStatus = ["ACTIVE", "INACTIVE"];

    if (!allowedStatus.includes(status)) {
        return ResponseHelper.error(
            res,
            "Invalid status value.",
            null,
            422
        );
    }

    const client = await adminClientService.updateClientStatus(
        req.params.uuid,
        status,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client status updated successfully.",
        client
    );
});

// soft delete client
const deleteClient = asyncHandler(async (req, res) => {
    await adminClientService.deleteClient(req.params.uuid);

    return ResponseHelper.success(res, "Client deleted successfully.");
});

// restore client
const restoreClient = asyncHandler(async (req, res) => {
    const client = await adminClientService.restoreClient(
        req.params.uuid,
        req.user.id
    );

    return ResponseHelper.success(
        res,
        "Client restored successfully.",
        client
    );
});

// force delete client
const forceDeleteClient = asyncHandler(async (req, res) => {
    const result = await adminClientService.forceDeleteClient(
        req.params.uuid
    );

    return ResponseHelper.success(
        res,
        "Client permanently deleted.",
        result
    );
});

// get trash client
const getTrashClients = asyncHandler(async (req, res) => {
    const result = await adminClientService.getTrashClients({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search || "",
    });

    return ResponseHelper.success(
        res,
        "Trash clients fetched successfully.",
        result
    );
});

// Get client agreement contract
const getClientAgreement = asyncHandler(async (req, res) => {
    const agreementUrl = await adminClientService.getClientAgreement(
        req.params.uuid
    );

    try {
        const response = await fetch(agreementUrl);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch agreement: ${response.status}`
            );
        }

        const contentType =
            response.headers.get("content-type") || "application/pdf";

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'inline; filename="agreement.pdf"'
        );
        res.setHeader("Content-Length", buffer.length);

        return res.send(buffer);
    } catch (error) {
        throw new ApiError(500, "Unable to open agreement contract.");
    }
});

module.exports = {
    createClient,
    getClients,
    getClient,
    updateClient,
    updateClientStatus,
    deleteClient,
    restoreClient,
    forceDeleteClient,
    getTrashClients,
    getClientAgreement,
};