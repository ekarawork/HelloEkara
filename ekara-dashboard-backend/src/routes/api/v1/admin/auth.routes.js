const express = require("express");
const router = express.Router();
const {authController} = require("../../../../controllers/index");
const authMiddleware = require("../../../../middleware/authenticate");

router.post(
    "/login", 
    authController.login
);

router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post(
    "/logout",
    authController.logout
);

router.post(
    "/logout-all",
    authMiddleware,
    authController.logoutAll
);

module.exports = router;