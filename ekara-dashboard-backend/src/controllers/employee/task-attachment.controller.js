"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    employeeTaskAttachmentService,
} = require("../../services/index");
const {
    employee,
} = require("../../database/models");
const {
    employeeTaskAttachmentTaskUuidSchema,
    employeeTaskAttachmentUuidSchema,
    employeeTaskMessageAttachmentParamsSchema,
    employeeCreateTaskAttachmentSchema,
    employeeUpdateTaskAttachmentSchema,
    employeeTaskAttachmentListSchema,
} = require("../../validations/employee/task-attachment.validation");

/* ========================= Helpers ========================= */

const validateRequest = (schema, data) => {
    const {
        error,
        value,
    } = schema.validate(data, {
        abortEarly: true,
    });

    if (error) {
        return {
            error: error.details[0].message,
            value: null,
        };
    }

    return {
        error: null,
        value,
    };
};

const getUploadedFile = (req) => {
    if (!req.file) {
        return {
            error: "Attachment file is required",
            file: null,
        };
    }

    return {
        error: null,
        file: req.file,
    };
};


/* ========================= Authenticated Employee Helper ========================= */

/**
 * Resolve employees.id from logged-in users.id.
 *
 * req.user.id belongs to users table.
 * task_assignments.employee_id belongs to employees table.
 */
const getAuthenticatedEmployeeId = async (req) => {
    const userId = req.user?.id;

    if (!userId) {
        return null;
    }

    const employeeRecord = await employee.findOne({
        where: {
            user_id: userId,
            status: "ACTIVE",
        },
        attributes: ["id", "user_id"],
    });

    return employeeRecord?.id || null;
};

/* ========================= Task Attachments ========================= */

/**
 * Upload direct task attachment
 *
 * POST /api/v1/employee/tasks/:uuid/attachments
 */
const createAttachment = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (uuidError) {
            return ResponseHelper.error(
                res,
                uuidError,
                null,
                422
            );
        }

        const {
            error: payloadError,
            value: payload,
        } = validateRequest(
            employeeCreateTaskAttachmentSchema,
            req.body
        );

        if (payloadError) {
            return ResponseHelper.error(
                res,
                payloadError,
                null,
                422
            );
        }

        const {
            error: fileError,
            file,
        } = getUploadedFile(req);

        if (fileError) {
            return ResponseHelper.error(
                res,
                fileError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const attachment =
            await employeeTaskAttachmentService.createAttachment({
                taskUuid: uuidValue.uuid,
                employeeId,
                messageUuid: payload.message_uuid || null,
                file,
            });

        return ResponseHelper.success(
            res,
            "Task attachment uploaded successfully.",
            attachment,
            201
        );
    }
);

/**
 * Get task attachments
 *
 * GET /api/v1/employee/tasks/:uuid/attachments
 */
const getAttachments = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (uuidError) {
            return ResponseHelper.error(
                res,
                uuidError,
                null,
                422
            );
        }

        const {
            error: queryError,
            value: query,
        } = validateRequest(
            employeeTaskAttachmentListSchema,
            req.query
        );

        if (queryError) {
            return ResponseHelper.error(
                res,
                queryError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const result =
            await employeeTaskAttachmentService.getAttachments({
                taskUuid: uuidValue.uuid,
                employeeId,
                page: query.page,
                limit: query.limit,
                resourceType: query.resource_type,
            });

        return ResponseHelper.success(
            res,
            "Task attachments fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get direct task attachments
 *
 * GET /api/v1/employee/tasks/:uuid/attachments/direct
 */
const getDirectAttachments = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (uuidError) {
            return ResponseHelper.error(
                res,
                uuidError,
                null,
                422
            );
        }

        const {
            error: queryError,
            value: query,
        } = validateRequest(
            employeeTaskAttachmentListSchema,
            req.query
        );

        if (queryError) {
            return ResponseHelper.error(
                res,
                queryError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const result =
            await employeeTaskAttachmentService.getDirectAttachments({
                taskUuid: uuidValue.uuid,
                employeeId,
                page: query.page,
                limit: query.limit,
                resourceType: query.resource_type,
            });

        return ResponseHelper.success(
            res,
            "Direct task attachments fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get message attachments
 *
 * GET /api/v1/employee/tasks/:uuid/messages/:message_uuid/attachments
 */
const getMessageAttachments = asyncHandler(
    async (req, res) => {

        const {
            error: paramsError,
            value: paramsValue,
        } = validateRequest(
            employeeTaskMessageAttachmentParamsSchema,
            req.params
        );

        if (paramsError) {
            return ResponseHelper.error(
                res,
                paramsError,
                null,
                422
            );
        }

        const {
            error: queryError,
            value: query,
        } = validateRequest(
            employeeTaskAttachmentListSchema,
            req.query
        );

        if (queryError) {
            return ResponseHelper.error(
                res,
                queryError,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const result =
            await employeeTaskAttachmentService.getMessageAttachments({
                taskUuid: paramsValue.uuid,
                messageUuid: paramsValue.message_uuid,
                employeeId,
                page: query.page,
                limit: query.limit,
                resourceType: query.resource_type,
            });

        return ResponseHelper.success(
            res,
            "Message attachments fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get single attachment
 *
 * GET /api/v1/employee/tasks/:uuid/attachments/:attachment_uuid
 */
const getAttachment = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskAttachmentUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const attachment =
            await employeeTaskAttachmentService.getAttachment(
                value.uuid,
                value.attachment_uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task attachment fetched successfully.",
            attachment,
            200
        );
    }
);

/**
 * Delete own attachment
 *
 * DELETE /api/v1/employee/tasks/:uuid/attachments/:attachment_uuid
 */
const deleteAttachment = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskAttachmentUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        await employeeTaskAttachmentService.deleteAttachment(
            value.uuid,
            value.attachment_uuid,
            employeeId
        );

        return ResponseHelper.success(
            res,
            "Task attachment deleted successfully.",
            null,
            200
        );
    }
);

/**
 * Count task attachments
 *
 * GET /api/v1/employee/tasks/:uuid/attachments/count
 */
const countAttachments = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const count =
            await employeeTaskAttachmentService.countAttachments(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task attachment count fetched successfully.",
            { count },
            200
        );
    }
);

/**
 * Count message attachments
 *
 * GET /api/v1/employee/tasks/:uuid/messages/:message_uuid/attachments/count
 */
const countMessageAttachments = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageAttachmentParamsSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const count =
            await employeeTaskAttachmentService.countMessageAttachments(
                value.uuid,
                value.message_uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Message attachment count fetched successfully.",
            { count },
            200
        );
    }
);

/**
 * Get latest attachment
 *
 * GET /api/v1/employee/tasks/:uuid/attachments/latest
 */
const getLatestAttachment = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const attachment =
            await employeeTaskAttachmentService.getLatestAttachment(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Latest task attachment fetched successfully.",
            attachment,
            200
        );
    }
);

/**
 * Get attachment IDs
 *
 * GET /api/v1/employee/tasks/:uuid/attachments/ids
 */
const getAttachmentIds = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskAttachmentTaskUuidSchema,
            req.params
        );

        if (error) {
            return ResponseHelper.error(
                res,
                error,
                null,
                422
            );
        }

        const employeeId =
            await getAuthenticatedEmployeeId(req);

        if (!employeeId) {
            return ResponseHelper.error(
                res,
                "Employee profile not found or inactive.",
                null,
                403
            );
        }

        const ids =
            await employeeTaskAttachmentService.getAttachmentIds(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task attachment IDs fetched successfully.",
            ids,
            200
        );
    }
);

/* ========================= Exports ========================= */

module.exports = {
    createAttachment,
    getAttachments,
    getDirectAttachments,
    getMessageAttachments,
    getAttachment,
    deleteAttachment,
    countAttachments,
    countMessageAttachments,
    getLatestAttachment,
    getAttachmentIds,
};