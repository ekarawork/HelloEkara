import { dashboardApi } from "@/src/api/client/dashboard.api";

import {
  ClientDashboardQuery,
  ClientDashboardData,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   GET CLIENT DASHBOARD
========================================================= */

const getDashboard = async (
  query?: ClientDashboardQuery
): Promise<ClientDashboardData> => {
  const response =
    await dashboardApi.getDashboard(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch client dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const dashboardService = {
  getDashboard,
};