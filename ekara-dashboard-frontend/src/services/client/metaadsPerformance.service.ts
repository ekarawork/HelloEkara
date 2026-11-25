import { clientPerformanceApi } from "@/src/api/client/metaadsPerformance.api";

import {
  ClientMetaAdsDashboardQuery,
  ClientMetaAdsDashboardData,
} from "@/src/types/client/metaadsPerformance.types";

/* =========================================================
   GET CLIENT META ADS DASHBOARD
========================================================= */

const getMetaAdsDashboard = async (
  query?: ClientMetaAdsDashboardQuery
): Promise<ClientMetaAdsDashboardData> => {
  const response =
    await clientPerformanceApi.getMetaAdsDashboard(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch Meta Ads dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const clientPerformanceService = {
  getMetaAdsDashboard,
};