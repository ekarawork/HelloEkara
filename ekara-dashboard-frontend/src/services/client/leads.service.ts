import { leadsApi } from "@/src/api/client/leads.api";

import {
  ClientLeadsDashboardQuery,
  ClientLeadsDashboardData,
} from "@/src/types/client/leads.types";

/* =========================================================
   GET CLIENT LEADS DASHBOARD
========================================================= */

const getLeadsDashboard = async (
  query?: ClientLeadsDashboardQuery
): Promise<ClientLeadsDashboardData> => {
  const response =
    await leadsApi.getLeadsDashboard(
      query
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch Leads dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const leadsService = {
  getLeadsDashboard,
};