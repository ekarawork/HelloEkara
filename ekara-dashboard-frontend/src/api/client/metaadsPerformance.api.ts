import axiosInstance from "@/src/lib/axios";

import {
  ClientMetaAdsDashboardQuery,
  GetClientMetaAdsDashboardResponse,
} from "@/src/types/client/metaadsPerformance.types";

/* =========================================================
   GET CLIENT META ADS DASHBOARD
========================================================= */

const getMetaAdsDashboard = async (
  query: ClientMetaAdsDashboardQuery = {}
): Promise<GetClientMetaAdsDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientMetaAdsDashboardResponse>(
      "/client/meta-ads/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const clientPerformanceApi = {
  getMetaAdsDashboard,
};