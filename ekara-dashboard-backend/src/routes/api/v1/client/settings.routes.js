"use strict";

const express = require("express");

const router = express.Router();

const {
    clientSettingsController,
} = require("../../../../controllers/index");

const clientPortalAuthenticate =
    require("../../../../middleware/clientPortalAuthenticate");

/* =========================================================
   CLIENT PROFILE
========================================================= */

router.get(
    "/profile",
    clientPortalAuthenticate,
    clientSettingsController.getClientProfile
);

router.put(
    "/profile",
    clientPortalAuthenticate,
    clientSettingsController.updateClientProfile
);

/* =========================================================
   CLIENT SECURITY
========================================================= */

router.put(
    "/change-password",
    clientPortalAuthenticate,
    clientSettingsController.changeClientPassword
);

module.exports = router;