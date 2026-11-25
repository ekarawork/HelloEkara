"use strict";

const {
    generateAdminExport,
} = require("../../services/admin/export.service");


/* =========================================================
   EXPORT ADMIN DATA
========================================================= */

const exportAdminData = async (
    req,
    res
) => {
    try {
        const buffer =
            await generateAdminExport();

        const date =
            new Date()
                .toISOString()
                .slice(0, 10);

        const fileName =
            `ekara-admin-export-${date}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );

        res.setHeader(
            "Content-Length",
            buffer.length
        );

        return res.send(buffer);
    } catch (error) {
        console.error(
            "Admin export error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to export admin data.",
        });
    }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    exportAdminData,
};