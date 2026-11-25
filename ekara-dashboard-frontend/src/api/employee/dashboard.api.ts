import axiosInstance from "@/src/lib/axios";

import {
  EmployeeDashboardQuery,
  GetEmployeeDashboardResponse,
} from "@/src/types/employee/dashboard.types";

/* =========================================================
   GET EMPLOYEE DASHBOARD
========================================================= */

const getDashboard = async (
  query: EmployeeDashboardQuery = {}
): Promise<GetEmployeeDashboardResponse> => {
  const response =
    await axiosInstance.get<GetEmployeeDashboardResponse>(
      "/employee/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const dashboardApi = {
  getDashboard,
};