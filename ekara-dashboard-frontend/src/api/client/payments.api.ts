import axiosInstance from "@/src/lib/axios";

import {
  ClientPaymentDashboardQuery,
  GetClientPaymentDashboardResponse,
} from "@/src/types/client/payments.types";

/* =========================================================
   GET CLIENT PAYMENT DASHBOARD
========================================================= */

const getPaymentDashboard = async (
  query: ClientPaymentDashboardQuery = {}
): Promise<GetClientPaymentDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientPaymentDashboardResponse>(
      "/client/payments/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const paymentsApi = {
  getPaymentDashboard,
};