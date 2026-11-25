"use strict";

const {
    clientDashboardRepository,
} = require("../../repositories/index");

const ApiError = require("../../utils/ApiError");

/* =========================================================
   GET CLIENT DASHBOARD
========================================================= */

const getClientDashboard = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       CLIENT AUTHENTICATION
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
       FETCH DASHBOARD DATA
    ===================================================== */

    const dashboard =
        await clientDashboardRepository.getClientDashboard(
            clientId,
            {
                startDate,
                endDate,
            }
        );

    /* =====================================================
       PERFORMANCE SUMMARY
    ===================================================== */

    const totalSpend = Number(
        dashboard?.performance?.summary
            ?.totalSpend || 0
    );

    const totalImpressions = Number(
        dashboard?.performance?.summary
            ?.totalImpressions || 0
    );

    const totalClicks = Number(
        dashboard?.performance?.summary
            ?.totalClicks || 0
    );

    const totalLeads = Number(
        dashboard?.performance?.summary
            ?.totalLeads || 0
    );

    /* =====================================================
       CONVERSION RATE
       
       Conversion Rate =
       Leads / Clicks * 100
    ===================================================== */

    const conversionRate =
        totalClicks > 0
            ? Number(
                  (
                      (totalLeads /
                          totalClicks) *
                      100
                  ).toFixed(2)
              )
            : 0;

    /* =====================================================
       DAILY PERFORMANCE
    ===================================================== */

    const dailyPerformance =
        Array.isArray(
            dashboard?.performance
                ?.dailyPerformance
        )
            ? dashboard.performance.dailyPerformance.map(
                  (item) => ({
                      date: item.date,

                      leads: Number(
                          item.leads || 0
                      ),

                      spend: Number(
                          item.spend || 0
                      ),
                  })
              )
            : [];

    /* =====================================================
       CLIENT PROGRESS
    ===================================================== */

    const metaAds =
        dashboard?.clientProgress
            ?.metaAds || {
            serviceName: "META_ADS",
            spent: 0,
            budget: 0,
            percentage: 0,
        };

    const googleAds =
        dashboard?.clientProgress
            ?.googleAds || {
            serviceName: "GOOGLE_ADS",
            spent: 0,
            budget: 0,
            percentage: 0,
        };

    /* =====================================================
       CURRENT PAYMENT
    ===================================================== */

    const currentPayment =
        dashboard?.currentPayment || null;

    /* =====================================================
       UPCOMING CONTENT
    ===================================================== */

    const upcomingContent =
        dashboard?.upcomingContent || null;

    /* =====================================================
       RETURN DASHBOARD DATA
    ===================================================== */

    return {
        stats: {
            adSpend: totalSpend,
            leads: totalLeads,
            impressions: totalImpressions,
            clicks: totalClicks,
            conversionRate,
        },

        charts: {
            dailyLeads:
                dailyPerformance.map(
                    (item) => ({
                        date: item.date,
                        leads: item.leads,
                    })
                ),

            dailyAdSpend:
                dailyPerformance.map(
                    (item) => ({
                        date: item.date,
                        spend: item.spend,
                    })
                ),
        },

        clientProgress: {
            metaAds: {
                spent: Number(
                    metaAds.spent || 0
                ),

                budget: Number(
                    metaAds.budget || 0
                ),

                percentage: Number(
                    metaAds.percentage || 0
                ),
            },

            googleAds: {
                spent: Number(
                    googleAds.spent || 0
                ),

                budget: Number(
                    googleAds.budget || 0
                ),

                percentage: Number(
                    googleAds.percentage || 0
                ),
            },
        },

        payments: {
            current: currentPayment,
        },

        upcomingContent: {
            nextPost: upcomingContent,
        },
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientDashboard,
};