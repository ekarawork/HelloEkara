import axiosInstance from "@/src/lib/axios";

import {
  ClientLeadsDashboardQuery,
  GetClientLeadsDashboardResponse,
} from "@/src/types/client/leads.types";

/* =========================================================
   GET CLIENT LEADS DASHBOARD
========================================================= */

const getLeadsDashboard = async (
  query: ClientLeadsDashboardQuery = {}
): Promise<GetClientLeadsDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientLeadsDashboardResponse>(
      "/client/leads/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const leadsApi = {
  getLeadsDashboard,
};