import { dashboardApi } from "@/src/api/employee/dashboard.api";

import {
  EmployeeDashboardQuery,
  EmployeeDashboardData,
} from "@/src/types/employee/dashboard.types";

/* =========================================================
   GET EMPLOYEE DASHBOARD
========================================================= */

const getDashboard = async (
  query?: EmployeeDashboardQuery
): Promise<EmployeeDashboardData> => {
  const response =
    await dashboardApi.getDashboard(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch employee dashboard data."
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