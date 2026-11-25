"use strict";

const asyncHandler = require("../../middleware/asyncHandler");

const ResponseHelper =
    require("../../helpers/response.helper");

const {
    adminTaskMessageService,
} = require("../../services/index");

const {
    createTaskMessageSchema,
    updateTaskMessageSchema,
    taskMessageListSchema,
    taskMessageTypeSchema,
} = require("../../validations/admin/task.message.validation");

/* ========================= Create Task Message ========================= */

const createTaskMessage = asyncHandler(
    async (req, res) => {
        /* ========================= Validate Body ========================= */

        const {
            error,
            value,
        } =
            createTaskMessageSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error
            );
        }

        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Authenticated User ========================= */

        const senderId =
            req.user?.id;

        /* ========================= Create Message ========================= */

        const message =
            await adminTaskMessageService.createTaskMessage(
                uuid,
                value,
                senderId
            );

        return ResponseHelper.success(
            res,
            "Task message created successfully.",
            message,
            201
        );
    }
);

/* ========================= Get Task Messages ========================= */

const getTaskMessages = asyncHandler(
    async (req, res) => {
        /* ========================= Validate Query ========================= */

        const {
            error,
            value,
        } =
            taskMessageListSchema.validate(
                req.query,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error
            );
        }

        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Get Messages ========================= */

        const result =
            await adminTaskMessageService.getTaskMessages(
                uuid,
                value
            );

        return ResponseHelper.success(
            res,
            "Task messages fetched successfully.",
            result
        );
    }
);

/* ========================= Get All Task Messages ========================= */

const getAllTaskMessages = asyncHandler(
    async (req, res) => {
        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Get Messages ========================= */

        const messages =
            await adminTaskMessageService.getAllTaskMessages(
                uuid
            );

        return ResponseHelper.success(
            res,
            "Task messages fetched successfully.",
            messages
        );
    }
);

/* ========================= Get Task Message Details ========================= */

const getTaskMessage = asyncHandler(
    async (req, res) => {
        /* ========================= Message UUID ========================= */

        const {
            message_uuid,
        } = req.params;

        /* ========================= Get Message ========================= */

        const message =
            await adminTaskMessageService.getTaskMessage(
                message_uuid
            );

        return ResponseHelper.success(
            res,
            "Task message fetched successfully.",
            message
        );
    }
);

/* ========================= Update Task Message ========================= */

const updateTaskMessage = asyncHandler(
    async (req, res) => {
        /* ========================= Validate Body ========================= */

        const {
            error,
            value,
        } =
            updateTaskMessageSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error
            );
        }

        /* ========================= Message UUID ========================= */

        const {
            message_uuid,
        } = req.params;

        /* ========================= Authenticated User ========================= */

        const senderId =
            req.user?.id;

        /* ========================= Update Message ========================= */

        const message =
            await adminTaskMessageService.updateTaskMessage(
                message_uuid,
                value,
                senderId
            );

        return ResponseHelper.success(
            res,
            "Task message updated successfully.",
            message
        );
    }
);

/* ========================= Delete Task Message ========================= */

const deleteTaskMessage = asyncHandler(
    async (req, res) => {
        /* ========================= Message UUID ========================= */

        const {
            message_uuid,
        } = req.params;

        /* ========================= Authenticated User ========================= */

        const senderId =
            req.user?.id;

        /* ========================= Delete Message ========================= */

        const result =
            await adminTaskMessageService.deleteTaskMessage(
                message_uuid,
                senderId
            );

        return ResponseHelper.success(
            res,
            "Task message deleted successfully.",
            result
        );
    }
);

/* ========================= Get Latest Task Message ========================= */

const getLatestTaskMessage = asyncHandler(
    async (req, res) => {
        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Get Latest Message ========================= */

        const message =
            await adminTaskMessageService.getLatestTaskMessage(
                uuid
            );

        return ResponseHelper.success(
            res,
            "Latest task message fetched successfully.",
            message
        );
    }
);

/* ========================= Get Latest Task Messages ========================= */

const getLatestTaskMessages = asyncHandler(
    async (req, res) => {
        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Limit ========================= */

        const limit =
            Number(req.query.limit) || 20;

        /* ========================= Get Latest Messages ========================= */

        const messages =
            await adminTaskMessageService.getLatestTaskMessages(
                uuid,
                limit
            );

        return ResponseHelper.success(
            res,
            "Latest task messages fetched successfully.",
            messages
        );
    }
);

/* ========================= Count Task Messages ========================= */

const countTaskMessages = asyncHandler(
    async (req, res) => {
        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Count ========================= */

        const count =
            await adminTaskMessageService.countTaskMessages(
                uuid
            );

        return ResponseHelper.success(
            res,
            "Task message count fetched successfully.",
            {
                count,
            }
        );
    }
);

/* ========================= Count Task Messages By Type ========================= */

const countTaskMessagesByType = asyncHandler(
    async (req, res) => {
        /* ========================= Validate Message Type ========================= */

        const {
            error,
            value,
        } =
            taskMessageTypeSchema.validate(
                req.query,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {
            return ResponseHelper.validationError(
                res,
                error
            );
        }

        /* ========================= Task UUID ========================= */

        const {
            uuid,
        } = req.params;

        /* ========================= Count ========================= */

        const count =
            await adminTaskMessageService.countTaskMessagesByType(
                uuid,
                value.message_type
            );

        return ResponseHelper.success(
            res,
            "Task message count fetched successfully.",
            {
                message_type:
                    value.message_type,
                count,
            }
        );
    }
);

/* ========================= Export ========================= */

module.exports = {
    createTaskMessage,

    getTaskMessages,
    getAllTaskMessages,
    getTaskMessage,

    updateTaskMessage,
    deleteTaskMessage,

    getLatestTaskMessage,
    getLatestTaskMessages,

    countTaskMessages,
    countTaskMessagesByType,
};