"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  getClientProfile,
  updateClientProfile,
  changeClientPassword,
} from "@/src/services/client/settings.service";

import type {
  ClientProfile,
  UpdateClientProfilePayload,
  ChangeClientPasswordPayload,
} from "@/src/types/client/settings.types";

/* =========================================================
   HOOK
========================================================= */

export const useSettings = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     GET CLIENT PROFILE
  ======================================================= */

  const fetchClientProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getClientProfile();

      setProfile(data);

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch client profile.";

      setError(message);

      toast.error("Failed to load profile", {
        description: message,
      });

      /*
       * Do not throw the error here.
       *
       * This function is called from useEffect().
       * Throwing the error causes the Next.js runtime
       * error overlay when the backend is unavailable.
       */
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =======================================================
     UPDATE CLIENT PROFILE
  ======================================================= */

  const updateProfile = useCallback(
    async (payload: UpdateClientProfilePayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        const data = await updateClientProfile(payload);

        setProfile(data);

        toast.success("Profile updated successfully", {
          description:
            "Your client profile has been updated successfully.",
        });

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update client profile.";

        setError(message);

        toast.error("Profile update failed", {
          description: message,
        });

        /*
         * Keep throwing here because ClientProfileForm
         * handles the submit error.
         */
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* =======================================================
     CHANGE CLIENT PASSWORD
  ======================================================= */

  const changePassword = useCallback(
    async (payload: ChangeClientPasswordPayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        await changeClientPassword(payload);

        toast.success("Password updated successfully", {
          description:
            "Your account password has been updated successfully.",
        });

        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update password.";

        setError(message);

        toast.error("Password update failed", {
          description: message,
        });

        /*
         * Keep throwing here because ChangePasswordForm
         * handles the submit error.
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

    fetchClientProfile,
    updateProfile,
    changePassword,

    clearError,
  };
};

export default useSettings;