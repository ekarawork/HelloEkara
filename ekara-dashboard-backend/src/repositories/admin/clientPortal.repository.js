"use strict";

const {
    client,
} = require("../../database/models");

/* =========================================================
   FIND ACTIVE CLIENT
========================================================= */

const findActiveClientByUuid = async (
    uuid,
    options = {}
) => {
    return await client.findOne({
        where: {
            uuid,
            status: "ACTIVE",
        },
        attributes: [
            "id",
            "uuid",
            "name",
            "email",
            "login_id",
            "profile_photo",
            "monthly_service_fee",
            "status",
        ],
        ...options,
    });
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    findActiveClientByUuid,
};