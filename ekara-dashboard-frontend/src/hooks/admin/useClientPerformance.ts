"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { clientPerformanceService } from "@/src/services/admin/clientPerformance.service";

import {
  CreateClientPerformancePayload,
  ClientPerformance,
  ClientPerformanceListQuery,
  ClientPerformanceListResponseData,
  UpdateClientPerformancePayload,
  ClientPerformanceDashboardData,
  ClientPerformanceDashboardQuery,
} from "@/src/types/admin/clientPerformance.types";

interface UseClientPerformanceReturn {
  createPerformance: (
    payload: CreateClientPerformancePayload
  ) => Promise<ClientPerformance | null>;

  getPerformances: (
    query?: ClientPerformanceListQuery
  ) => Promise<ClientPerformanceListResponseData | null>;

  getPerformance: (
    performanceUuid: string
  ) => Promise<ClientPerformance | null>;

  updatePerformance: (
    performanceUuid: string,
    payload: UpdateClientPerformancePayload
  ) => Promise<ClientPerformance | null>;

  deletePerformance: (
    performanceUuid: string
  ) => Promise<boolean>;

  getTrashPerformances: (
    query?: ClientPerformanceListQuery
  ) => Promise<ClientPerformanceListResponseData | null>;

  restorePerformance: (
    performanceUuid: string
  ) => Promise<ClientPerformance | null>;

  forceDeletePerformance: (
    performanceUuid: string
  ) => Promise<boolean>;

  getDashboardPerformance: (
    query?: ClientPerformanceDashboardQuery
  ) => Promise<ClientPerformanceDashboardData | null>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Error Helper
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

// Hook
const useClientPerformance = (): UseClientPerformanceReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create Performance
  const createPerformance = useCallback(
    async (
      payload: CreateClientPerformancePayload
    ): Promise<ClientPerformance | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.createPerformance(
            payload
          );

        toast.success("Performance created successfully", {
          description:
            "The client performance record has been added successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to create performance. Please try again."
        );

        setError(message);

        toast.error("Performance creation failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Performance List
  const getPerformances = useCallback(
    async (
      query?: ClientPerformanceListQuery
    ): Promise<ClientPerformanceListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.getPerformances(query);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch client performances."
        );

        setError(message);

        toast.error("Failed to load performances", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Performance Details
  const getPerformance = useCallback(
    async (
      performanceUuid: string
    ): Promise<ClientPerformance | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.getPerformance(
            performanceUuid
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch performance details."
        );

        setError(message);

        toast.error("Failed to load performance", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update Performance
  const updatePerformance = useCallback(
    async (
      performanceUuid: string,
      payload: UpdateClientPerformancePayload
    ): Promise<ClientPerformance | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.updatePerformance(
            performanceUuid,
            payload
          );

        toast.success("Performance updated successfully", {
          description:
            "The client performance information has been updated.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update performance."
        );

        setError(message);

        toast.error("Performance update failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Soft Delete Performance
  const deletePerformance = useCallback(
    async (
      performanceUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await clientPerformanceService.deletePerformance(
          performanceUuid
        );

        toast.success("Performance moved to trash", {
          description:
            "The performance record has been moved to trash successfully.",
        });

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete performance."
        );

        setError(message);

        toast.error("Performance deletion failed", {
          description: message,
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Trash Performances
  const getTrashPerformances = useCallback(
    async (
      query?: ClientPerformanceListQuery
    ): Promise<ClientPerformanceListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.getTrashPerformances(
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch deleted performances."
        );

        setError(message);

        toast.error("Failed to load trash performances", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Restore Performance
  const restorePerformance = useCallback(
    async (
      performanceUuid: string
    ): Promise<ClientPerformance | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPerformanceService.restorePerformance(
            performanceUuid
          );

        toast.success("Performance restored successfully", {
          description:
            "The performance record has been restored successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to restore performance."
        );

        setError(message);

        toast.error("Performance restore failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Force Delete Performance
  const forceDeletePerformance = useCallback(
    async (
      performanceUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await clientPerformanceService.forceDeletePerformance(
          performanceUuid
        );

        toast.success("Performance permanently deleted", {
          description:
            "The performance record has been permanently deleted.",
        });

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to permanently delete performance."
        );

        setError(message);

        toast.error("Permanent deletion failed", {
          description: message,
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Performance Dashboard
const getDashboardPerformance = useCallback(
  async (
    query?: ClientPerformanceDashboardQuery
  ): Promise<ClientPerformanceDashboardData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        await clientPerformanceService.getDashboardPerformance(
          query
        );

      return data;
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to fetch performance dashboard."
      );

      setError(message);

      toast.error("Failed to load performance dashboard", {
        description: message,
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  // Clear Error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    createPerformance,
    getPerformances,
    getPerformance,
    updatePerformance,
    deletePerformance,
    getTrashPerformances,
    restorePerformance,
    forceDeletePerformance,
    getDashboardPerformance,
    isLoading,
    error,
    clearError,
  };
};

export default useClientPerformance;