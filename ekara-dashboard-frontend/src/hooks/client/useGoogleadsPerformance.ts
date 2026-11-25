"use client";

import {
  useCallback,
  useState,
} from "react";

import { toast } from "sonner";

import {
  googleAdsPerformanceService,
} from "@/src/services/client/googleadsPerformance.service";

import {
  ClientGoogleAdsDashboardQuery,
  ClientGoogleAdsDashboardData,
} from "@/src/types/client/googleadsPerformance.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseGoogleAdsPerformanceReturn {
  getGoogleAdsDashboard: (
    query?: ClientGoogleAdsDashboardQuery
  ) => Promise<ClientGoogleAdsDashboardData | null>;

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

const useGoogleAdsPerformance =
  (): UseGoogleAdsPerformanceReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET GOOGLE ADS DASHBOARD
    ======================================================= */

    const getGoogleAdsDashboard =
      useCallback(
        async (
          query?: ClientGoogleAdsDashboardQuery
        ): Promise<ClientGoogleAdsDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await googleAdsPerformanceService.getGoogleAdsDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch Google Ads dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load Google Ads dashboard",
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
      getGoogleAdsDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default useGoogleAdsPerformance;