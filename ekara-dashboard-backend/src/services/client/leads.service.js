"use strict";

const {
    clientLeadsRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* =========================================================
   GET CLIENT LEADS DASHBOARD
========================================================= */

const getClientLeadsDashboard = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       VALIDATE CLIENT
    ===================================================== */

    if (!clientId) {
        throw new ApiError(
            401,
            "Client authentication is required."
        );
    }

    /* =====================================================
       DATE VALIDATION
    ===================================================== */

    if (
        startDate &&
        endDate &&
        new Date(startDate) >
            new Date(endDate)
    ) {
        throw new ApiError(
            400,
            "Start date cannot be greater than end date."
        );
    }

    /* =====================================================
       GET LEADS DATA
    ===================================================== */

    const dashboard =
        await clientLeadsRepository.getClientLeadsDashboard(
            clientId,
            {
                startDate,
                endDate,
            }
        );

    /* =====================================================
       DAILY LEADS
    ===================================================== */

    const dailyLeads =
        (dashboard.dailyLeads || []).map(
            (item) => ({
                date:
                    item.performance_date,

                leads: Number(
                    item.leads || 0
                ),
            })
        );

    /* =====================================================
       LEADS BY PLATFORM
       TOTAL META + GOOGLE
    ===================================================== */

    const leadsByPlatform =
        (dashboard.leadsByPlatform || []).map(
            (item) => ({
                platform:
                    item.platform,

                leads: Number(
                    item.leads || 0
                ),
            })
        );

    /* =====================================================
       DAILY LEADS BY PLATFORM
       META + GOOGLE
    ===================================================== */

    const platformDailyLeadsMap =
        new Map();

    (
        dashboard.platformDailyLeads ||
        []
    ).forEach((item) => {
        const date =
            item.performance_date;

        if (!date) {
            return;
        }

        if (
            !platformDailyLeadsMap.has(
                date
            )
        ) {
            platformDailyLeadsMap.set(
                date,
                {
                    date,
                    meta: 0,
                    google: 0,
                }
            );
        }

        const current =
            platformDailyLeadsMap.get(
                date
            );

        const leads = Number(
            item.leads || 0
        );

        if (
            item.platform ===
            "META_ADS"
        ) {
            current.meta = leads;
        }

        if (
            item.platform ===
            "GOOGLE_ADS"
        ) {
            current.google = leads;
        }
    });

    const platformDailyLeads =
        Array.from(
            platformDailyLeadsMap.values()
        ).sort(
            (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime()
        );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return {
        dailyLeads,
        leadsByPlatform,
        platformDailyLeads,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientLeadsDashboard,
};