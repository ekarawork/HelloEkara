const express = require("express");
const router = express.Router();
const {
    adminClientPerformanceController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

/* ========================= Create Performance ========================= */

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.createPerformance
);

/* ========================= All Performance List ========================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.getAllPerformances
);

/* ========================= Performance List ========================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.getPerformances
);

/* ========================= Performance Details ========================= */

router.get(
    "/details/:performanceUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.getPerformance
);

/* ========================= Update Performance ========================= */

router.patch(
    "/update/:performanceUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.updatePerformance
);

/* ========================= Delete Performance ========================= */

// Soft delete performance
router.delete(
    "/trash/:performanceUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.deletePerformance
);

/* ========================= Trash Performance ========================= */

// Get deleted performance list
router.get(
    "/trash",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.getTrashPerformances
);

/* ========================= Restore Performance ========================= */

// Restore deleted performance
router.patch(
    "/restore/:performanceUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.restorePerformance
);

/* ========================= Force Delete Performance ========================= */

// Permanently delete performance
router.delete(
    "/force-delete/:performanceUuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.forceDeletePerformance
);

/* ========================= Performance Summary ========================= */

router.get(
    "/dashboard",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientPerformanceController.getDashboardPerformance
);

module.exports = router;