"use client";

import {
  useCallback,
  useState,
} from "react";

import { toast } from "sonner";

import {
  paymentsService,
} from "@/src/services/client/payments.service";

import {
  ClientPaymentDashboardQuery,
  ClientPaymentDashboardData,
} from "@/src/types/client/payments.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UsePaymentsReturn {
  getPaymentDashboard: (
    query?: ClientPaymentDashboardQuery
  ) => Promise<ClientPaymentDashboardData | null>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/* =========================================================
   ERROR HELPER
========================================================= */

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};

/* =========================================================
   HOOK
========================================================= */

const usePayments =
  (): UsePaymentsReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET PAYMENT DASHBOARD
    ======================================================= */

    const getPaymentDashboard =
      useCallback(
        async (
          query?: ClientPaymentDashboardQuery
        ): Promise<ClientPaymentDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await paymentsService.getPaymentDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch Payment dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load Payment dashboard",
              {
                description: message,
              }
            );

            return null;
          } finally {
            setIsLoading(false);
          }
        },
        []
      );

    /* =======================================================
       CLEAR ERROR
    ======================================================= */

    const clearError = useCallback(
      (): void => {
        setError(null);
      },
      []
    );

    /* =======================================================
       RETURN
    ======================================================= */

    return {
      getPaymentDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default usePayments;