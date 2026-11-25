"use strict";

const {
    clientGoogleAdsPerformanceRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* =========================================================
   GET CLIENT GOOGLE ADS DASHBOARD
========================================================= */

const getClientGoogleAdsDashboard = async (
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
       GET GOOGLE ADS DATA
    ===================================================== */

    const dashboard =
        await clientGoogleAdsPerformanceRepository.getClientGoogleAdsDashboard(
            clientId,
            {
                startDate,
                endDate,
            }
        );

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summaryData =
        dashboard.summary?.toJSON?.() ||
        dashboard.summary ||
        {};

    const totalSpend = Number(
        summaryData.totalSpend || 0
    );

    const totalImpressions = Number(
        summaryData.totalImpressions || 0
    );

    const totalClicks = Number(
        summaryData.totalClicks || 0
    );

    const totalLeads = Number(
        summaryData.totalLeads || 0
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
       DAILY SPEND
    ===================================================== */

    const dailySpend =
        (dashboard.dailySpend || []).map(
            (item) => ({
                date:
                    item.performance_date,

                spend: Number(
                    item.spend || 0
                ),
            })
        );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return {
        stats: {
            spend: totalSpend,

            impressions:
                totalImpressions,

            clicks:
                totalClicks,

            leads:
                totalLeads,
        },

        dailyLeads,

        dailySpend,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientGoogleAdsDashboard,
};