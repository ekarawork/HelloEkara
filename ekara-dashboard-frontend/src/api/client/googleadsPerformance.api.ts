import axiosInstance from "@/src/lib/axios";

import {
  ClientGoogleAdsDashboardQuery,
  GetClientGoogleAdsDashboardResponse,
} from "@/src/types/client/googleadsPerformance.types";

/* =========================================================
   GET CLIENT GOOGLE ADS DASHBOARD
========================================================= */

const getGoogleAdsDashboard = async (
  query: ClientGoogleAdsDashboardQuery = {}
): Promise<GetClientGoogleAdsDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientGoogleAdsDashboardResponse>(
      "/client/google-ads/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const googleAdsPerformanceApi = {
  getGoogleAdsDashboard,
};