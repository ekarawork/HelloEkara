"use strict";

const {
    adminDashboardRepository,
} = require("../../repositories/index");

const logger = require("../../utils/winston.util");

/* =========================================================
   GET ADMIN DASHBOARD DATA
========================================================= */

/**
 * Get admin dashboard data
 *
 * @param {Object} query
 * @returns {Object}
 */
const getDashboardData = async (query = {}) => {
    try {
        /* =====================================================
           DAYS
        ===================================================== */

        let days = Number(query.days);

        /*
         * Default:
         * 7 days
         *
         * Minimum:
         * 1 day
         *
         * Maximum:
         * 365 days
         */

        if (!Number.isFinite(days) || days <= 0) {
            days = 7;
        }

        days = Math.min(
            Math.max(Math.floor(days), 1),
            365
        );

        /* =====================================================
           GET DASHBOARD DATA
        ===================================================== */

        const dashboardData =
            await adminDashboardRepository.getDashboardData({
                days,
            });

        /* =====================================================
           RETURN DATA
        ===================================================== */

        return dashboardData;
    } catch (error) {
        logger.error(
            `Failed to fetch admin dashboard data: ${error.message}`
        );

        throw error;
    }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getDashboardData,
};