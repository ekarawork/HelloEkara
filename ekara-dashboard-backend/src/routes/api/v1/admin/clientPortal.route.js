"use strict";

const express = require("express");

const router = express.Router();

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

const {
    clientPortalController,
} = require("../../../../controllers/index");

/* =========================================================
   ADMIN → CLIENT PORTAL PREVIEW
========================================================= */

router.post(
    "/:uuid/access",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    clientPortalController.createClientPortalAccess
);

/* =========================================================
   VERIFY PREVIEW TOKEN
========================================================= */

router.get(
    "/verify",
    clientPortalController.verifyClientPortalAccess
);

/* =========================================================
   EXPORT
========================================================= */

module.exports = router;