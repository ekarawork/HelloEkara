"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getPaymentReminderSettings,
  updatePaymentReminderSettings as updatePaymentReminderSettingsService,
} from "@/src/services/admin/settings.service";

import type {
  AdminProfile,
  UpdateAdminProfilePayload,
  ChangeAdminPasswordPayload,
  PaymentReminderSettings,
  UpdatePaymentReminderSettingsPayload,
} from "@/src/types/admin/settings.types";

/* =========================================================
   HOOK
========================================================= */

export const useSettings = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const [paymentReminderSettings, setPaymentReminderSettings] =
    useState<PaymentReminderSettings | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isReminderLoading, setIsReminderLoading] = useState(false);
  const [isReminderUpdating, setIsReminderUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     GET ADMIN PROFILE
  ======================================================= */

  const fetchAdminProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAdminProfile();

      setProfile(data);

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch admin profile.";

      setError(message);

      toast.error("Failed to load profile", {
        description: message,
      });

      /*
       * Do not re-throw fetch errors.
       * This function is called during page rendering/useEffect.
       */
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =======================================================
     UPDATE ADMIN PROFILE
  ======================================================= */

  const updateProfile = useCallback(
    async (payload: UpdateAdminProfilePayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        const data = await updateAdminProfile(payload);

        setProfile(data);

        toast.success("Profile updated successfully", {
          description:
            "Your admin profile has been updated successfully.",
        });

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update admin profile.";

        setError(message);

        toast.error("Profile update failed", {
          description: message,
        });

        /*
         * Keep throw for form submit error handling.
         */
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* =======================================================
     CHANGE ADMIN PASSWORD
  ======================================================= */

  const changePassword = useCallback(
    async (payload: ChangeAdminPasswordPayload) => {
      try {
        setIsUpdating(true);
        setError(null);

        await changeAdminPassword(payload);

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
         * Keep throw for form submit error handling.
         */
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* =======================================================
     GET PAYMENT REMINDER SETTINGS
  ======================================================= */

  const fetchPaymentReminderSettings = useCallback(async () => {
    try {
      setIsReminderLoading(true);
      setError(null);

      const data = await getPaymentReminderSettings();

      setPaymentReminderSettings(data);

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch payment reminder settings.";

      setError(message);

      toast.error("Failed to load payment reminder settings", {
        description: message,
      });

      /*
       * Do not re-throw fetch errors.
       */
      return null;
    } finally {
      setIsReminderLoading(false);
    }
  }, []);

  /* =======================================================
     UPDATE PAYMENT REMINDER SETTINGS
  ======================================================= */

  const updatePaymentReminderSettings = useCallback(
    async (payload: UpdatePaymentReminderSettingsPayload) => {
      try {
        setIsReminderUpdating(true);
        setError(null);

        const data =
          await updatePaymentReminderSettingsService(payload);

        setPaymentReminderSettings(data);

        toast.success("Payment reminder settings updated", {
          description:
            "Your payment reminder defaults have been updated successfully.",
        });

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update payment reminder settings.";

        setError(message);

        toast.error("Payment reminder update failed", {
          description: message,
        });

        /*
         * Keep throw for form submit error handling.
         */
        throw error;
      } finally {
        setIsReminderUpdating(false);
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
    paymentReminderSettings,

    isLoading,
    isUpdating,

    isReminderLoading,
    isReminderUpdating,

    error,

    fetchAdminProfile,
    updateProfile,
    changePassword,

    fetchPaymentReminderSettings,
    updatePaymentReminderSettings,

    clearError,
  };
};

export default useSettings;