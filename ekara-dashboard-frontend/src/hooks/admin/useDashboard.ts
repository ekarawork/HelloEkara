"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { dashboardService } from "@/src/services/admin/dashboard.service";

import {
  DashboardQuery,
  DashboardResponseData,
} from "@/src/types/admin/dashboard.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseDashboardReturn {
  getDashboardData: (
    query?: DashboardQuery
  ) => Promise<DashboardResponseData | null>;

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

const useDashboard = (): UseDashboardReturn => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     GET DASHBOARD DATA
  ======================================================= */

  const getDashboardData = useCallback(
    async (
      query?: DashboardQuery
    ): Promise<DashboardResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await dashboardService.getDashboardData(query);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch dashboard data."
        );

        setError(message);

        toast.error("Failed to load dashboard", {
          description: message,
        });

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

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    getDashboardData,
    isLoading,
    error,
    clearError,
  };
};

export default useDashboard;