import { dashboardApi } from "@/src/api/admin/dashboard.api";

import {
  DashboardQuery,
  DashboardResponseData,
} from "@/src/types/admin/dashboard.types";

/* =========================================================
   GET DASHBOARD DATA
========================================================= */

const getDashboardData = async (
  query?: DashboardQuery
): Promise<DashboardResponseData> => {
  const response = await dashboardApi.getDashboardData(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const dashboardService = {
  getDashboardData,
};