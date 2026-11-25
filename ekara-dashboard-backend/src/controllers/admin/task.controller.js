"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminTaskService,
} = require("../../services/index");

const {
    createTaskSchema,
    updateTaskSchema,
    taskPrioritySchema,
    taskStatusSchema,
    taskAssignmentSchema,
} = require("../../validations/admin/task.validation");

/* ========================= Create Task ========================= */

const createTask = asyncHandler(async (req, res) => {
    const { error, value } =
        createTaskSchema.validate(req.body, {
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

    /* ========================= Create Task ========================= */

    const task =
        await adminTaskService.createTask(
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Task created successfully.",
        task,
        201
    );
});

/* ========================= Get Tasks ========================= */

const getTasks = asyncHandler(async (req, res) => {
    const tasks =
        await adminTaskService.getTasks({
            page:
                Number(req.query.page) || 1,

            limit:
                Number(req.query.limit) || 10,

            search:
                req.query.search || "",

            status:
                req.query.status,

            priority:
                req.query.priority,

            client_id:
                req.query.client_id
                    ? Number(
                          req.query.client_id
                      )
                    : undefined,

            employee_id:
                req.query.employee_id
                    ? Number(
                          req.query.employee_id
                      )
                    : undefined,
        });

    return ResponseHelper.success(
        res,
        "Tasks fetched successfully.",
        tasks
    );
});

/* ========================= Get Task Details ========================= */

const getTask = asyncHandler(async (req, res) => {
    const task =
        await adminTaskService.getTask(
            req.params.uuid
        );

    return ResponseHelper.success(
        res,
        "Task fetched successfully.",
        task
    );
});

/* ========================= Update Task ========================= */

const updateTask = asyncHandler(async (req, res) => {
    const { error, value } =
        updateTaskSchema.validate(req.body, {
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

    /* ========================= Update Task ========================= */

    const task =
        await adminTaskService.updateTask(
            req.params.uuid,
            value,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Task updated successfully.",
        task
    );
});

/* ========================= Update Task Priority ========================= */

const updateTaskPriority = asyncHandler(
    async (req, res) => {
        const { error, value } =
            taskPrioritySchema.validate(
                req.body,
                {
                    abortEarly: true,
                    convert: true,
                }
            );

        if (error) {
            return ResponseHelper.error(
                res,
                error.details[0].message,
                null,
                422
            );
        }

        const task =
            await adminTaskService.updateTaskPriority(
                req.params.uuid,
                value.priority,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Task priority updated successfully.",
            task
        );
    }
);

/* ========================= Update Task Status ========================= */

const updateTaskStatus = asyncHandler(
    async (req, res) => {
        const { error, value } =
            taskStatusSchema.validate(
                req.body,
                {
                    abortEarly: true,
                    convert: true,
                }
            );

        if (error) {
            return ResponseHelper.error(
                res,
                error.details[0].message,
                null,
                422
            );
        }

        const task =
            await adminTaskService.updateTaskStatus(
                req.params.uuid,
                value.status,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Task status updated successfully.",
            task
        );
    }
);

/* ========================= Soft Delete Task ========================= */

const deleteTask = asyncHandler(async (req, res) => {
    await adminTaskService.deleteTask(
        req.params.uuid
    );

    return ResponseHelper.success(
        res,
        "Task deleted successfully."
    );
});

/* ========================= Restore Task ========================= */

const restoreTask = asyncHandler(async (req, res) => {
    const task =
        await adminTaskService.restoreTask(
            req.params.uuid,
            req.user.id
        );

    return ResponseHelper.success(
        res,
        "Task restored successfully.",
        task
    );
});

/* ========================= Force Delete Task ========================= */

const forceDeleteTask = asyncHandler(
    async (req, res) => {
        const result =
            await adminTaskService.forceDeleteTask(
                req.params.uuid
            );

        return ResponseHelper.success(
            res,
            "Task permanently deleted.",
            result
        );
    }
);

/* ========================= Get Trash Tasks ========================= */

const getTrashTasks = asyncHandler(
    async (req, res) => {
        const result =
            await adminTaskService.getTrashTasks({
                page:
                    Number(req.query.page) || 1,

                limit:
                    Number(req.query.limit) || 10,

                search:
                    req.query.search || "",

                priority:
                    req.query.priority,

                status:
                    req.query.status,

                client_id:
                    req.query.client_id
                        ? Number(
                              req.query.client_id
                          )
                        : undefined,
            });

        return ResponseHelper.success(
            res,
            "Trash tasks fetched successfully.",
            result
        );
    }
);

/* ========================= Add Task Assignment ========================= */

const addTaskAssignment = asyncHandler(
    async (req, res) => {
        const { error, value } =
            taskAssignmentSchema.validate(
                req.body,
                {
                    abortEarly: true,
                    convert: true,
                }
            );

        if (error) {
            return ResponseHelper.error(
                res,
                error.details[0].message,
                null,
                422
            );
        }

        const assignment =
            await adminTaskService.addTaskAssignment(
                req.params.uuid,
                value.employee_id,
                req.user.id
            );

        return ResponseHelper.success(
            res,
            "Employee assigned to task successfully.",
            assignment,
            201
        );
    }
);

/* ========================= Remove Task Assignment ========================= */

const removeTaskAssignment =
    asyncHandler(async (req, res) => {
        const employeeId =
            Number(
                req.params.employee_id
            );

        if (
            !employeeId ||
            employeeId <= 0
        ) {
            return ResponseHelper.error(
                res,
                "Valid employee ID is required.",
                null,
                422
            );
        }

        await adminTaskService.removeTaskAssignment(
            req.params.uuid,
            employeeId
        );

        return ResponseHelper.success(
            res,
            "Employee removed from task successfully."
        );
    });

/* ========================= Get Task Assignments ========================= */

const getTaskAssignments =
    asyncHandler(async (req, res) => {
        const assignments =
            await adminTaskService.getTaskAssignments(
                req.params.uuid
            );

        return ResponseHelper.success(
            res,
            "Task assignments fetched successfully.",
            assignments
        );
    });

/* ========================= Exports ========================= */

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    updateTaskPriority,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    forceDeleteTask,
    getTrashTasks,
    addTaskAssignment,
    removeTaskAssignment,
    getTaskAssignments,
};