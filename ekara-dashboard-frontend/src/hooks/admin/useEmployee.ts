"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { employeeService } from "@/src/services/admin/employee.service";

import {
  CreateEmployeePayload,
  Employee,
  EmployeeListQuery,
  EmployeeListResponseData,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
} from "@/src/types/admin/employee.types";

/* ========================= Hook Return Type ========================= */

interface UseEmployeeReturn {
  createEmployee: (
    payload: CreateEmployeePayload
  ) => Promise<Employee | null>;

  getEmployees: (
    query?: EmployeeListQuery
  ) => Promise<EmployeeListResponseData | null>;

  getEmployee: (
    uuid: string
  ) => Promise<Employee | null>;

  updateEmployee: (
    uuid: string,
    payload: UpdateEmployeePayload
  ) => Promise<Employee | null>;

  updateEmployeeStatus: (
    uuid: string,
    payload: UpdateEmployeeStatusPayload
  ) => Promise<Employee | null>;

  deleteEmployee: (
    uuid: string
  ) => Promise<boolean>;

  restoreEmployee: (
    uuid: string
  ) => Promise<Employee | null>;

  forceDeleteEmployee: (
    uuid: string
  ) => Promise<boolean>;

  getTrashEmployees: (
    query?: EmployeeListQuery
  ) => Promise<EmployeeListResponseData | null>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/* ========================= Error Helper ========================= */

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

/* ========================= Hook ========================= */

const useEmployee = (): UseEmployeeReturn => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ========================= Create Employee ========================= */

  const createEmployee = useCallback(
    async (
      payload: CreateEmployeePayload
    ): Promise<Employee | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.createEmployee(
            payload
          );

        toast.success(
          "Employee created successfully",
          {
            description:
              "The new employee has been added successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to create employee. Please try again."
        );

        setError(message);

        toast.error(
          "Employee creation failed",
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

  /* ========================= Get Employees ========================= */

  const getEmployees = useCallback(
    async (
      query?: EmployeeListQuery
    ): Promise<EmployeeListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.getEmployees(
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch employees."
        );

        setError(message);

        toast.error(
          "Failed to load employees",
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

  /* ========================= Get Employee Details ========================= */

  const getEmployee = useCallback(
    async (
      uuid: string
    ): Promise<Employee | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.getEmployee(
            uuid
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch employee details."
        );

        setError(message);

        toast.error(
          "Failed to load employee",
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

  /* ========================= Update Employee ========================= */

  const updateEmployee = useCallback(
    async (
      uuid: string,
      payload: UpdateEmployeePayload
    ): Promise<Employee | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.updateEmployee(
            uuid,
            payload
          );

        toast.success(
          "Employee updated successfully",
          {
            description:
              "The employee information has been updated.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update employee."
        );

        setError(message);

        toast.error(
          "Employee update failed",
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

  /* ========================= Update Employee Status ========================= */

  const updateEmployeeStatus = useCallback(
    async (
      uuid: string,
      payload: UpdateEmployeeStatusPayload
    ): Promise<Employee | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.updateEmployeeStatus(
            uuid,
            payload
          );

        toast.success(
          "Employee status updated",
          {
            description:
              "The employee status has been updated successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update employee status."
        );

        setError(message);

        toast.error(
          "Status update failed",
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

  /* ========================= Soft Delete Employee ========================= */

  const deleteEmployee = useCallback(
    async (
      uuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await employeeService.deleteEmployee(
          uuid
        );

        toast.success(
          "Employee moved to trash",
          {
            description:
              "The employee has been moved to trash successfully.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete employee."
        );

        setError(message);

        toast.error(
          "Employee deletion failed",
          {
            description: message,
          }
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Restore Employee ========================= */

  const restoreEmployee = useCallback(
    async (
      uuid: string
    ): Promise<Employee | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.restoreEmployee(
            uuid
          );

        toast.success(
          "Employee restored successfully",
          {
            description:
              "The employee has been restored successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to restore employee."
        );

        setError(message);

        toast.error(
          "Employee restore failed",
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

  /* ========================= Force Delete Employee ========================= */

  const forceDeleteEmployee = useCallback(
    async (
      uuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await employeeService.forceDeleteEmployee(
          uuid
        );

        toast.success(
          "Employee permanently deleted",
          {
            description:
              "The employee has been permanently deleted.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to permanently delete employee."
        );

        setError(message);

        toast.error(
          "Permanent deletion failed",
          {
            description: message,
          }
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Trash Employees ========================= */

  const getTrashEmployees = useCallback(
    async (
      query?: EmployeeListQuery
    ): Promise<EmployeeListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await employeeService.getTrashEmployees(
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch deleted employees."
        );

        setError(message);

        toast.error(
          "Failed to load trash employees",
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

  /* ========================= Clear Error ========================= */

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /* ========================= Return ========================= */

  return {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    updateEmployeeStatus,
    deleteEmployee,
    restoreEmployee,
    forceDeleteEmployee,
    getTrashEmployees,
    isLoading,
    error,
    clearError,
  };
};

export default useEmployee;