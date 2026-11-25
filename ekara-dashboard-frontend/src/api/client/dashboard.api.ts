import axiosInstance from "@/src/lib/axios";

import {
  ClientDashboardQuery,
  GetClientDashboardResponse,
} from "@/src/types/client/dashboard.types";

/* =========================================================
   GET CLIENT DASHBOARD
========================================================= */

const getDashboard = async (
  query: ClientDashboardQuery = {}
): Promise<GetClientDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientDashboardResponse>(
      "/client/dashboard",
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