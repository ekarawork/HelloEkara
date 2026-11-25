"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  clientPerformanceService,
} from "@/src/services/client/metaadsPerformance.service";

import {
  ClientMetaAdsDashboardQuery,
  ClientMetaAdsDashboardData,
} from "@/src/types/client/metaadsPerformance.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseClientPerformanceReturn {
  getMetaAdsDashboard: (
    query?: ClientMetaAdsDashboardQuery
  ) => Promise<ClientMetaAdsDashboardData | null>;

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

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

/* =========================================================
   HOOK
========================================================= */

const useClientPerformance =
  (): UseClientPerformanceReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET META ADS DASHBOARD
    ======================================================= */

    const getMetaAdsDashboard =
      useCallback(
        async (
          query?: ClientMetaAdsDashboardQuery
        ): Promise<ClientMetaAdsDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await clientPerformanceService.getMetaAdsDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch Meta Ads dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load Meta Ads dashboard",
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
      getMetaAdsDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default useClientPerformance;