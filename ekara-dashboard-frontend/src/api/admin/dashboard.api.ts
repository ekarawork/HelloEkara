import axiosInstance from "@/src/lib/axios";

import {
  DashboardQuery,
  GetDashboardResponse,
} from "@/src/types/admin/dashboard.types";

/* =========================================================
   GET ADMIN DASHBOARD
========================================================= */

const getDashboardData = async (
  query: DashboardQuery = {}
): Promise<GetDashboardResponse> => {
  const response = await axiosInstance.get<GetDashboardResponse>(
    "/admin/dashboard",
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
  getDashboardData,
};