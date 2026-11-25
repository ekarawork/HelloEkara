import { socialCalendarApi } from "@/src/api/client/socialCalendar.api";

import {
  ClientSocialCalendarDashboardQuery,
  ClientSocialCalendarDashboardData,
} from "@/src/types/client/socialCalendar.types";

/* =========================================================
   GET CLIENT SOCIAL CALENDAR DASHBOARD
========================================================= */

const getSocialCalendarDashboard = async (
  query?: ClientSocialCalendarDashboardQuery
): Promise<ClientSocialCalendarDashboardData> => {
  const response =
    await socialCalendarApi.getSocialCalendarDashboard(
      query
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch Social Calendar dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const socialCalendarService = {
  getSocialCalendarDashboard,
};