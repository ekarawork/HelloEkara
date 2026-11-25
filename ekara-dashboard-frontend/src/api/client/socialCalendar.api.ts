import axiosInstance from "@/src/lib/axios";

import {
  ClientSocialCalendarDashboardQuery,
  GetClientSocialCalendarDashboardResponse,
} from "@/src/types/client/socialCalendar.types";

/* =========================================================
   GET CLIENT SOCIAL CALENDAR DASHBOARD
========================================================= */

const getSocialCalendarDashboard = async (
  query: ClientSocialCalendarDashboardQuery = {}
): Promise<GetClientSocialCalendarDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientSocialCalendarDashboardResponse>(
      "/client/social-calendar/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const socialCalendarApi = {
  getSocialCalendarDashboard,
};