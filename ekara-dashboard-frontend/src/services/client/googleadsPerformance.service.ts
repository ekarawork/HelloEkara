import { googleAdsPerformanceApi } from "@/src/api/client/googleadsPerformance.api";

import {
  ClientGoogleAdsDashboardQuery,
  ClientGoogleAdsDashboardData,
} from "@/src/types/client/googleadsPerformance.types";

/* =========================================================
   GET CLIENT GOOGLE ADS DASHBOARD
========================================================= */

const getGoogleAdsDashboard = async (
  query?: ClientGoogleAdsDashboardQuery
): Promise<ClientGoogleAdsDashboardData> => {
  const response =
    await googleAdsPerformanceApi.getGoogleAdsDashboard(
      query
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch Google Ads dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const googleAdsPerformanceService = {
  getGoogleAdsDashboard,
};