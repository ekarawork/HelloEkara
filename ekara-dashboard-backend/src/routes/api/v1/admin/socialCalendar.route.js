"use strict";

const express = require("express");

const router = express.Router();

const {
    adminSocialCalendarController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

/* ========================= Create ========================= */

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminSocialCalendarController.createSocialCalendarPost
);

/* ========================= List ========================= */

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminSocialCalendarController.getSocialCalendarPosts
);

/* ========================= Get By UUID ========================= */

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminSocialCalendarController.getSocialCalendarPost
);

/* ========================= Update ========================= */

router.patch(
    "/update/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminSocialCalendarController.updateSocialCalendarPost
);

/* ========================= Delete ========================= */

router.delete(
    "/delete/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminSocialCalendarController.deleteSocialCalendarPost
);

module.exports = router;