"use strict";

const express = require("express");

const router =
    express.Router();

const {
    exportAdminData,
} = require("../../../../controllers/admin/export.controller");

const authenticate =
    require("../../../../middleware/authenticate");


/* =========================================================
   EXPORT ADMIN DATA
========================================================= */

router.get(
    "/",
    authenticate,
    exportAdminData
);


module.exports = router;