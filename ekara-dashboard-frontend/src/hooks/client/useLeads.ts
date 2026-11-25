"use client";

import {
  useCallback,
  useState,
} from "react";

import { toast } from "sonner";

import {
  leadsService,
} from "@/src/services/client/leads.service";

import {
  ClientLeadsDashboardQuery,
  ClientLeadsDashboardData,
} from "@/src/types/client/leads.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseLeadsReturn {
  getLeadsDashboard: (
    query?: ClientLeadsDashboardQuery
  ) => Promise<ClientLeadsDashboardData | null>;

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

const useLeads =
  (): UseLeadsReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET LEADS DASHBOARD
    ======================================================= */

    const getLeadsDashboard =
      useCallback(
        async (
          query?: ClientLeadsDashboardQuery
        ): Promise<ClientLeadsDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await leadsService.getLeadsDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch Leads dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load Leads dashboard",
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
      getLeadsDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default useLeads;