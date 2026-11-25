"use client";

import axiosInstance from "@/src/lib/axios";

import type {
  AdminProfile,
  UpdateAdminProfilePayload,
  ChangeAdminPasswordPayload,
  PaymentReminderSettings,
  UpdatePaymentReminderSettingsPayload,
} from "@/src/types/admin/settings.types";

/* =========================================================
   GET ADMIN PROFILE
========================================================= */

export const getAdminProfileApi = async (): Promise<AdminProfile> => {
  const response = await axiosInstance.get<{
    data: AdminProfile;
  }>("/settings/profile");

  return response.data.data;
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

export const updateAdminProfileApi = async (
  payload: UpdateAdminProfilePayload
): Promise<AdminProfile> => {
  const response = await axiosInstance.put<{
    data: AdminProfile;
  }>("/settings/profile", payload);

  return response.data.data;
};

/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

export const changeAdminPasswordApi = async (
  payload: ChangeAdminPasswordPayload
): Promise<void> => {
  await axiosInstance.put(
    "/settings/change-password",
    payload
  );
};


/* =========================================================
   GET PAYMENT REMINDER SETTINGS
========================================================= */

export const getPaymentReminderSettingsApi =
  async (): Promise<PaymentReminderSettings> => {
    const response = await axiosInstance.get<{
      data: PaymentReminderSettings;
    }>("/settings/payment-reminders");

    return response.data.data;
  };


/* =========================================================
   UPDATE PAYMENT REMINDER SETTINGS
========================================================= */

export const updatePaymentReminderSettingsApi =
  async (
    payload: UpdatePaymentReminderSettingsPayload
  ): Promise<PaymentReminderSettings> => {
    const response = await axiosInstance.put<{
      data: PaymentReminderSettings;
    }>(
      "/settings/payment-reminders",
      payload
    );

    return response.data.data;
  };