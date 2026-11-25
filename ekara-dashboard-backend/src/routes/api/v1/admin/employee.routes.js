"use strict";

const express = require("express");

const router = express.Router();

const {
    adminEmployeeController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

const upload =
    require("../../../../middleware/uploadImage.middleware");

const uploadFolder =
    require("../../../../middleware/uploadFolder");

/* ========================= Create Employee ========================= */

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    uploadFolder("employees"),
    upload.fields([
        {
            name: "profile_image",
            maxCount: 1,
        },
    ]),
    adminEmployeeController.createEmployee
);

/* ========================= Get Employees ========================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.getEmployees
);

/* ========================= Get Employee Details ========================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.getEmployee
);

/* ========================= Update Employee ========================= */

router.patch(
    "/update/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    uploadFolder("employees"),
    upload.fields([
        {
            name: "profile_image",
            maxCount: 1,
        },
    ]),
    adminEmployeeController.updateEmployee
);

/* ========================= Update Employee Status ========================= */

router.patch(
    "/status/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.updateEmployeeStatus
);

/* ========================= Soft Delete Employee ========================= */

router.delete(
    "/trash/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.deleteEmployee
);

/* ========================= Restore Employee ========================= */

router.patch(
    "/restore/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.restoreEmployee
);

/* ========================= Force Delete Employee ========================= */

router.delete(
    "/force-delete/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.forceDeleteEmployee
);

/* ========================= Get Trash Employees ========================= */

router.get(
    "/trash",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminEmployeeController.getTrashEmployees
);

module.exports = router;