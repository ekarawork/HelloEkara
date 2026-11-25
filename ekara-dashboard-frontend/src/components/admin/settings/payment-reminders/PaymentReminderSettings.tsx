"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarClock,
  Loader2,
  Save,
} from "lucide-react";

import { useSettings } from "@/src/hooks/admin/useSettings";
import PaymentReminderSettingsSkeleton from "./PaymentReminderSettingsSkeleton";
import type {
  PaymentReminderSettings as PaymentReminderSettingsType,
} from "@/src/types/admin/settings.types";


/* =========================================================
   TYPES
========================================================= */

type PaymentReminderSettingsState = Pick<
  PaymentReminderSettingsType,
  | "before_due_enabled"
  | "before_due_days"
  | "due_day_enabled"
  | "after_due_enabled"
  | "after_due_days"
>;


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS: PaymentReminderSettingsState = {
  before_due_enabled: true,
  before_due_days: 3,

  due_day_enabled: true,

  after_due_enabled: true,
  after_due_days: 1,
};


/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentReminderSettings() {
  /* =======================================================
     HOOK
  ======================================================= */

const {
  paymentReminderSettings,
  isReminderLoading,
  isReminderUpdating,
  fetchPaymentReminderSettings,
  updatePaymentReminderSettings,
} = useSettings();


  /* =======================================================
     STATE
  ======================================================= */

  const [settings, setSettings] =
    useState<PaymentReminderSettingsState>(
      DEFAULT_SETTINGS
    );

  const [saved, setSaved] = useState(false);


  /* =======================================================
     FETCH SETTINGS
  ======================================================= */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await fetchPaymentReminderSettings();
      } catch {
        // Error/toast is already handled inside useSettings.
      }
    };

    loadSettings();
  }, [fetchPaymentReminderSettings]);


  /* =======================================================
     SYNC API DATA WITH LOCAL STATE
  ======================================================= */

  useEffect(() => {
    if (!paymentReminderSettings) {
      return;
    }

    setSettings({
      before_due_enabled:
        paymentReminderSettings.before_due_enabled,

      before_due_days:
        paymentReminderSettings.before_due_days,

      due_day_enabled:
        paymentReminderSettings.due_day_enabled,

      after_due_enabled:
        paymentReminderSettings.after_due_enabled,

      after_due_days:
        paymentReminderSettings.after_due_days,
    });

    setSaved(false);
  }, [paymentReminderSettings]);


  /* =======================================================
     TOGGLE HANDLER
  ======================================================= */

  const handleToggle = (
    field:
      | "before_due_enabled"
      | "due_day_enabled"
      | "after_due_enabled"
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: !current[field],
    }));

    setSaved(false);
  };


  /* =======================================================
     DAYS CHANGE HANDLER
  ======================================================= */

  const handleDaysChange = (
    field:
      | "before_due_days"
      | "after_due_days",
    value: string
  ) => {
    const parsedValue = Number(value);

    setSettings((current) => ({
      ...current,
      [field]: Number.isNaN(parsedValue)
        ? 0
        : parsedValue,
    }));

    setSaved(false);
  };


  /* =======================================================
     SAVE
  ======================================================= */

/* =========================================================
   SAVE
========================================================= */

const handleSave = async () => {
  try {
    setSaved(false);

    await updatePaymentReminderSettings({
      before_due_enabled:
        settings.before_due_enabled,

      before_due_days:
        settings.before_due_days,

      due_day_enabled:
        settings.due_day_enabled,

      after_due_enabled:
        settings.after_due_enabled,

      after_due_days:
        settings.after_due_days,
    });

    setSaved(true);
  } catch {
    // Error/toast is already handled inside useSettings.
  }
};


/* =======================================================
   LOADING
======================================================= */

if (isReminderLoading) {
  return <PaymentReminderSettingsSkeleton />;
}


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          PAGE CARD
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
              <Bell
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Reminders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure when payment reminders should be
                sent to clients.
              </p>
            </div>
          </div>
        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="divide-y divide-gray-100">
          {/* =================================================
              BEFORE DUE
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
                  <CalendarClock
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Before Due Date
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
                    Send a reminder to the client before the
                    payment due date.
                  </p>
                </div>
              </div>


              {/* Toggle */}

              <button
                type="button"
                role="switch"
                aria-checked={
                  settings.before_due_enabled
                }
                onClick={() =>
                  handleToggle(
                    "before_due_enabled"
                  )
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 ${
                  settings.before_due_enabled
                    ? "bg-[#2E3192] shadow-sm"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.before_due_enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>


            {/* Days */}

            {settings.before_due_enabled && (
              <div className="mt-5 ml-0 sm:ml-12">
                <label
                  htmlFor="before_due_days"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Send reminder
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="before_due_days"
                    type="number"
                    min={1}
                    max={365}
                    value={
                      settings.before_due_days
                    }
                    onChange={(event) =>
                      handleDaysChange(
                        "before_due_days",
                        event.target.value
                      )
                    }
                    className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <span className="text-sm text-gray-500">
                    day(s) before the due date
                  </span>
                </div>
              </div>
            )}
          </div>


          {/* =================================================
              DUE DAY
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
                  <Bell
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Due Date
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
                    Send a payment reminder to the client on
                    the payment due date.
                  </p>
                </div>
              </div>


              {/* Toggle */}

              <button
                type="button"
                role="switch"
                aria-checked={
                  settings.due_day_enabled
                }
                onClick={() =>
                  handleToggle(
                    "due_day_enabled"
                  )
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 ${
                  settings.due_day_enabled
                    ? "bg-[#2E3192] shadow-sm"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.due_day_enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>


          {/* =================================================
              AFTER DUE
          ================================================= */}

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
                  <CalendarClock
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    After Due Date
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
                    Send a reminder when the payment becomes
                    overdue.
                  </p>
                </div>
              </div>


              {/* Toggle */}

              <button
                type="button"
                role="switch"
                aria-checked={
                  settings.after_due_enabled
                }
                onClick={() =>
                  handleToggle(
                    "after_due_enabled"
                  )
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-200 ${
                  settings.after_due_enabled
                    ? "bg-[#2E3192] shadow-sm"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.after_due_enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>


            {/* Days */}

            {settings.after_due_enabled && (
              <div className="mt-5 ml-0 sm:ml-12">
                <label
                  htmlFor="after_due_days"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Send reminder
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="after_due_days"
                    type="number"
                    min={1}
                    max={365}
                    value={
                      settings.after_due_days
                    }
                    onChange={(event) =>
                      handleDaysChange(
                        "after_due_days",
                        event.target.value
                      )
                    }
                    className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <span className="text-sm text-gray-500">
                    day(s) after the due date
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">

          <button
            type="button"
            onClick={handleSave}
            disabled={isReminderUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isReminderUpdating ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={16} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}