import { paymentsApi } from "@/src/api/client/payments.api";

import {
  ClientPaymentDashboardQuery,
  ClientPaymentDashboardData,
} from "@/src/types/client/payments.types";

/* =========================================================
   GET CLIENT PAYMENT DASHBOARD
========================================================= */

const getPaymentDashboard = async (
  query?: ClientPaymentDashboardQuery
): Promise<ClientPaymentDashboardData> => {
  const response =
    await paymentsApi.getPaymentDashboard(
      query
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch Payment dashboard data."
    );
  }

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const paymentsService = {
  getPaymentDashboard,
};