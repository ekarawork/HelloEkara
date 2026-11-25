"use client";

import {
  getAdminProfileApi,
  updateAdminProfileApi,
  changeAdminPasswordApi,
  getPaymentReminderSettingsApi,
  updatePaymentReminderSettingsApi,
} from "@/src/api/admin/settings.api";

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

export const getAdminProfile = async (): Promise<AdminProfile> => {
  return await getAdminProfileApi();
};


/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

export const updateAdminProfile = async (
  payload: UpdateAdminProfilePayload
): Promise<AdminProfile> => {
  return await updateAdminProfileApi(payload);
};


/* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

export const changeAdminPassword = async (
  payload: ChangeAdminPasswordPayload
): Promise<void> => {
  await changeAdminPasswordApi(payload);
};


/* =========================================================
   GET PAYMENT REMINDER SETTINGS
========================================================= */

export const getPaymentReminderSettings =
  async (): Promise<PaymentReminderSettings> => {
    return await getPaymentReminderSettingsApi();
  };


/* =========================================================
   UPDATE PAYMENT REMINDER SETTINGS
========================================================= */

export const updatePaymentReminderSettings =
  async (
    payload: UpdatePaymentReminderSettingsPayload
  ): Promise<PaymentReminderSettings> => {
    return await updatePaymentReminderSettingsApi(
      payload
    );
  };