"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  getEmployeeProfile,
  updateEmployeeProfile,
  changeEmployeePassword,
} from "@/src/services/employee/settings.service";

import type {
  EmployeeProfile,
  UpdateEmployeeProfilePayload,
  ChangeEmployeePasswordPayload,
} from "@/src/types/employee/settings.types";

/* =========================================================
   HOOK
========================================================= */

export const useSettings = () => {
  const [profile, setProfile] =
    useState<EmployeeProfile | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     GET EMPLOYEE PROFILE
  ======================================================= */

  const fetchEmployeeProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getEmployeeProfile();

      setProfile(data);

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch employee profile.";

      setError(message);

      toast.error("Failed to load profile", {
        description: message,
      });

      /*
       * Do not throw the error here.
       *
       * This function is called from useEffect().
       * Throwing the error can cause the Next.js
       * runtime error overlay when the backend
       * is unavailable.
       */
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =======================================================
     UPDATE EMPLOYEE PROFILE
  ======================================================= */

  const updateProfile = useCallback(
    async (payload: UpdateEmployeeProfilePayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        const data =
          await updateEmployeeProfile(payload);

        setProfile(data);

        toast.success("Profile updated successfully", {
          description:
            "Your employee profile has been updated successfully.",
        });

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update employee profile.";

        setError(message);

        toast.error("Profile update failed", {
          description: message,
        });

        /*
         * Keep throwing here because
         * EmployeeProfileForm handles
         * the submit error.
         */
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* =======================================================
     CHANGE EMPLOYEE PASSWORD
  ======================================================= */

  const changePassword = useCallback(
    async (payload: ChangeEmployeePasswordPayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        await changeEmployeePassword(payload);

        toast.success("Password updated successfully", {
          description:
            "Your employee account password has been updated successfully.",
        });

        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update employee password.";

        setError(message);

        toast.error("Password update failed", {
          description: message,
        });

        /*
         * Keep throwing here because
         * ChangePasswordForm handles
         * the submit error.
         */
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    profile,

    isLoading,
    isUpdating,

    error,

    fetchEmployeeProfile,
    updateProfile,
    changePassword,

    clearError,
  };
};

export default useSettings;