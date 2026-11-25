"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  dashboardService,
} from "@/src/services/employee/dashboard.service";

import {
  EmployeeDashboardQuery,
  EmployeeDashboardData,
} from "@/src/types/employee/dashboard.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseDashboardReturn {
  getDashboard: (
    query?: EmployeeDashboardQuery
  ) => Promise<EmployeeDashboardData | null>;

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

const useDashboard =
  (): UseDashboardReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET EMPLOYEE DASHBOARD
    ======================================================= */

    const getDashboard =
      useCallback(
        async (
          query?: EmployeeDashboardQuery
        ): Promise<EmployeeDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await dashboardService.getDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch employee dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load dashboard",
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
      getDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default useDashboard;