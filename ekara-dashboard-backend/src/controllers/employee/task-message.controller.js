"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");

const {
    employeeTaskMessageService,
} = require("../../services/index");

const {
    employeeTaskUuidSchema,
    employeeCreateTaskMessageSchema,
    employeeUpdateTaskMessageSchema,
    employeeTaskMessageUuidSchema,
    employeeTaskMessageListSchema,
    employeeTaskMessageTypeSchema,
} = require("../../validations/employee/task-message.validation");
const {
    employee,
} = require("../../database/models");

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
/* ========================= Task Messages ========================= */

/**
 * Create employee task message
 *
 * POST /api/v1/employee/tasks/:uuid/messages
 */
/**
 * Create employee task message
 *
 * POST /api/v1/employee/tasks/:uuid/messages
 */
const createMessage = asyncHandler(
    async (req, res) => {
        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskUuidSchema,
            {
                uuid: req.params.uuid,
            }
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
            employeeCreateTaskMessageSchema,
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

        const message =
            await employeeTaskMessageService.createMessage(
                uuidValue.uuid,
                employeeId,
                payload
            );

        return ResponseHelper.success(
            res,
            "Task message created successfully.",
            message,
            201
        );
    }
);

/**
 * Get paginated task messages
 *
 * GET /api/v1/employee/tasks/:uuid/messages
 */
const getMessages = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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
            employeeTaskMessageListSchema,
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
            await employeeTaskMessageService.getMessages({
                taskUuid: uuidValue.uuid,
                employeeId,
                page: query.page,
                limit: query.limit,
                search: query.search,
                messageType: query.message_type,
            });

        return ResponseHelper.success(
            res,
            "Task messages fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get all task messages
 *
 * GET /api/v1/employee/tasks/:uuid/messages/all
 */
const getAllMessages = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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

        const messages =
            await employeeTaskMessageService.getAllMessages(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "All task messages fetched successfully.",
            messages,
            200
        );
    }
);

/**
 * Get single task message
 *
 * GET /api/v1/employee/tasks/:uuid/messages/:message_uuid
 */
const getMessage = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
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

        const message =
            await employeeTaskMessageService.getMessage(
                value.uuid,
                value.message_uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task message fetched successfully.",
            message,
            200
        );
    }
);

/**
 * Get latest message
 *
 * GET /api/v1/employee/tasks/:uuid/messages/latest
 */
const getLatestMessage = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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

        const message =
            await employeeTaskMessageService.getLatestMessage(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Latest task message fetched successfully.",
            message,
            200
        );
    }
);

/**
 * Get latest messages
 *
 * GET /api/v1/employee/tasks/:uuid/messages/latest-list
 */
const getLatestMessages = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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

        const messages =
            await employeeTaskMessageService.getLatestMessages(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Latest task messages fetched successfully.",
            messages,
            200
        );
    }
);

/**
 * Update own task message
 *
 * PATCH /api/v1/employee/tasks/:uuid/messages/:message_uuid
 */
const updateMessage = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
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
            employeeUpdateTaskMessageSchema,
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

        const message =
            await employeeTaskMessageService.updateMessage(
                uuidValue.uuid,
                uuidValue.message_uuid,
                employeeId,
                payload
            );

        return ResponseHelper.success(
            res,
            "Task message updated successfully.",
            message,
            200
        );
    }
);

/**
 * Delete own task message
 *
 * DELETE /api/v1/employee/tasks/:uuid/messages/:message_uuid
 */
const deleteMessage = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
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

        await employeeTaskMessageService.deleteMessage(
            value.uuid,
            value.message_uuid,
            employeeId
        );

        return ResponseHelper.success(
            res,
            "Task message deleted successfully.",
            null,
            200
        );
    }
);

/**
 * Count task messages
 *
 * GET /api/v1/employee/tasks/:uuid/messages/count
 */
const countMessages = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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
            await employeeTaskMessageService.countMessages(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task message count fetched successfully.",
            { count },
            200
        );
    }
);

/**
 * Count messages by type
 *
 * GET /api/v1/employee/tasks/:uuid/messages/count-by-type
 */
const countMessagesByType = asyncHandler(
    async (req, res) => {

        const {
            error: uuidError,
            value: uuidValue,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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
            error: typeError,
            value: typeValue,
        } = validateRequest(
            employeeTaskMessageTypeSchema,
            req.query
        );

        if (typeError) {
            return ResponseHelper.error(
                res,
                typeError,
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
            await employeeTaskMessageService.countMessagesByType(
                uuidValue.uuid,
                employeeId,
                typeValue.message_type
            );

        return ResponseHelper.success(
            res,
            "Task message type count fetched successfully.",
            result,
            200
        );
    }
);

/**
 * Get task message IDs
 *
 * GET /api/v1/employee/tasks/:uuid/messages/ids
 */
const getMessageIds = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } = validateRequest(
            employeeTaskMessageUuidSchema,
            {
                uuid: req.params.uuid,
                message_uuid: undefined,
            }
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
            await employeeTaskMessageService.getMessageIds(
                value.uuid,
                employeeId
            );

        return ResponseHelper.success(
            res,
            "Task message IDs fetched successfully.",
            ids,
            200
        );
    }
);

/* ========================= Exports ========================= */

module.exports = {
    createMessage,
    getMessages,
    getAllMessages,
    getMessage,
    getLatestMessage,
    getLatestMessages,
    updateMessage,
    deleteMessage,
    countMessages,
    countMessagesByType,
    getMessageIds,
};