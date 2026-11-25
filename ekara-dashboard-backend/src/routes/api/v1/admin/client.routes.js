const express = require("express");

const router = express.Router();

const {
    adminClientController,
} = require("../../../../controllers/index");

const authenticate = require("../../../../middleware/authenticate");
const authorize = require("../../../../middleware/authorize");

const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

router.post(
    "/create",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    uploadFolder("clients"),
    upload.fields([
        {
            name: "profile_photo",
            maxCount: 1,
        },
        {
            name: "agreement_contract",
            maxCount: 1,
        },
    ]),
    adminClientController.createClient
);

router.get(
    "/list",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.getClients
);

router.get(
    "/list/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.getClient
);

router.patch(
    "/update/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    uploadFolder("clients"),
    upload.fields([
        {
            name: "profile_photo",
            maxCount: 1,
        },
        {
            name: "agreement_contract",
            maxCount: 1,
        },
    ]),
    adminClientController.updateClient
);

router.patch(
    "/status/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.updateClientStatus
);

router.delete(
    "/trash/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.deleteClient
);

router.patch(
    "/restore/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.restoreClient
);

router.delete(
    "/force-delete/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.forceDeleteClient
);

router.get(
    "/trash",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.getTrashClients
);

router.get(
    "/agreement/:uuid",
    authenticate,
    authorize("SUPER_ADMIN", "ADMIN"),
    adminClientController.getClientAgreement
);

module.exports = router;