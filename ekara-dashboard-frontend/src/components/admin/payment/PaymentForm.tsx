"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Plus, Trash2, X } from "lucide-react";

import type {
  CreatePaymentPayload,
  PaymentReminderType,
  PaymentStatus,
  UpdatePaymentPayload,
} from "@/src/types/admin/payment.types";

import { useSettings } from "@/src/hooks/admin/useSettings";

/* =========================================================
   TYPES
========================================================= */

export interface PaymentFormData {
  client_id: string;
  payment_month: string;
  amount: string;
  due_date: string;
  status: PaymentStatus;
  enable_reminders: boolean;
  reminders: PaymentReminderFormData[];
}

export interface PaymentReminderFormData {
  reminder_type: PaymentReminderType;
  enabled: boolean;
  days_offset: string;
  message: string;
}

/*
 * Client option used by the payment form.
 *
 * Keep this export name as ClientOption because
 * the admin payment page imports it directly.
 */
export interface PaymentClientOption {
  id: number;
  uuid: string;
  name: string;
}

interface BasePaymentFormProps {
  clients?: PaymentClientOption[];
  onClose?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface CreatePaymentFormProps
  extends BasePaymentFormProps {
  mode?: "add";
  initialData?: undefined;
  onSubmit?: (
    data: CreatePaymentPayload
  ) => void | Promise<void>;
}

interface UpdatePaymentFormProps
  extends BasePaymentFormProps {
  mode: "edit";
  initialData?: Partial<PaymentFormData>;
  onSubmit?: (
    data: UpdatePaymentPayload
  ) => void | Promise<void>;
}

type PaymentFormProps =
  | CreatePaymentFormProps
  | UpdatePaymentFormProps;


/* =========================================================
   CONSTANTS
========================================================= */

const REMINDER_TYPES: PaymentReminderType[] = [
  "before",
  "due_day",
  "after",
];

const reminderLabels: Record<
  PaymentReminderType,
  string
> = {
  before: "Before Due Date",
  due_day: "Due Day",
  after: "After Due Date",
};

const reminderDescriptions: Record<
  PaymentReminderType,
  string
> = {
  before:
    "Send a reminder before the payment due date.",
  due_day:
    "Send a reminder on the payment due date.",
  after:
    "Send a reminder after the payment due date.",
};


/* =========================================================
   DEFAULT REMINDER MESSAGE
========================================================= */

const getDefaultReminderMessage = (
  type: PaymentReminderType
): string => {
  switch (type) {
    case "due_day":
      return "Your monthly payment is due today. Please clear your due amount.";

    case "after":
      return "Your monthly payment is overdue. Please clear your due amount as soon as possible.";

    case "before":
    default:
      return "Your monthly payment is coming up. Please arrange the payment before the due date.";
  }
};


/* =========================================================
   CREATE REMINDER FROM SETTINGS
========================================================= */

const createReminderFromSettings = (
  type: PaymentReminderType,
  settings: {
    before_due_days: number;
    after_due_days: number;
  }
): PaymentReminderFormData => {
  return {
    reminder_type: type,

    enabled: true,

    days_offset:
      type === "due_day"
        ? "0"
        : type === "before"
          ? String(
              settings.before_due_days
            )
          : String(
              settings.after_due_days
            ),

    message:
      getDefaultReminderMessage(type),
  };
};


/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentForm(
  props: PaymentFormProps
) {
  const {
    initialData,
    clients = [],
    onClose,
    isLoading = false,
    error = null,
  } = props;

  const mode = props.mode ?? "add";
  const isEditMode = mode === "edit";


  /* =======================================================
     SETTINGS
  ======================================================= */

  const {
    paymentReminderSettings,
    isReminderLoading,
    fetchPaymentReminderSettings,
  } = useSettings();


  /* =======================================================
     STATE
  ======================================================= */

  const [formData, setFormData] =
    useState<PaymentFormData>({
      client_id: "",
      payment_month: "",
      amount: "",
      due_date: "",
      status: "due",
      enable_reminders: false,
      reminders: [],
    });

  const [validationError, setValidationError] =
    useState<string | null>(null);

  /*
   * Tracks whether reminder defaults have already
   * been applied to a new payment.
   *
   * This prevents settings API updates/re-renders
   * from resetting user's manually edited reminders.
   */
  const [
    hasInitializedReminderDefaults,
    setHasInitializedReminderDefaults,
  ] = useState(false);


  /* =========================================================
     NORMALIZE PAYMENT MONTH
  ========================================================= */

  const normalizePaymentMonth = (
    value: string | undefined | null
  ): string => {
    if (!value) {
      return "";
    }

    /*
     * Input type="month" expects:
     * YYYY-MM
     *
     * Backend may return:
     * YYYY-MM-DD
     * YYYY-MM-DDTHH:mm:ss.sssZ
     */
    return value.slice(0, 7);
  };


  /* =========================================================
     FETCH PAYMENT REMINDER SETTINGS
  ========================================================= */

  useEffect(() => {
    /*
     * We only need global settings when creating
     * a NEW payment.
     *
     * Existing/edit payments must keep their
     * existing reminder configuration.
     */
    if (isEditMode) {
      return;
    }

    fetchPaymentReminderSettings().catch(() => {
      /*
       * Error/toast is already handled
       * inside useSettings.
       */
    });
  }, [
    isEditMode,
    fetchPaymentReminderSettings,
  ]);


  /* =========================================================
     INITIAL DATA
  ========================================================= */

  useEffect(() => {
    if (!initialData) {
      return;
    }

    /*
     * Edit mode:
     *
     * Existing reminders are loaded exactly as they
     * currently exist. Global Settings must NOT
     * overwrite them.
     */
    setFormData((previous) => ({
      ...previous,
      ...initialData,

      client_id:
        initialData.client_id !== undefined
          ? String(initialData.client_id)
          : previous.client_id,

      payment_month:
        initialData.payment_month !== undefined
          ? normalizePaymentMonth(
              initialData.payment_month
            )
          : previous.payment_month,

      amount:
        initialData.amount !== undefined
          ? String(initialData.amount)
          : previous.amount,

      due_date:
        initialData.due_date ??
        previous.due_date,

      status:
        initialData.status ??
        previous.status,

      enable_reminders:
        initialData.enable_reminders ??
        previous.enable_reminders,

      reminders:
        initialData.reminders
          ? initialData.reminders.map(
              (reminder) => ({
                reminder_type:
                  reminder.reminder_type,

                enabled:
                  reminder.enabled ?? true,

                days_offset:
                  reminder.days_offset !== null &&
                  reminder.days_offset !== undefined
                    ? String(
                        reminder.days_offset
                      )
                    : reminder.reminder_type ===
                        "due_day"
                      ? "0"
                      : "1",

                message:
                  reminder.message || "",
              })
            )
          : previous.reminders,
    }));

    setHasInitializedReminderDefaults(true);
  }, [initialData]);


  /* =========================================================
     APPLY GLOBAL SETTINGS TO NEW PAYMENT
  ========================================================= */

  useEffect(() => {
    /*
     * Never apply global settings in edit mode.
     */
    if (isEditMode) {
      return;
    }

    /*
     * Wait until settings are fetched.
     */
    if (
      isReminderLoading ||
      !paymentReminderSettings
    ) {
      return;
    }

    /*
     * Apply only once.
     */
    if (hasInitializedReminderDefaults) {
      return;
    }

    const defaultReminders: PaymentReminderFormData[] =
      [];

    /*
     * BEFORE
     */
    if (
      paymentReminderSettings.before_due_enabled
    ) {
      defaultReminders.push(
        createReminderFromSettings(
          "before",
          paymentReminderSettings
        )
      );
    }

    /*
     * DUE DAY
     */
    if (
      paymentReminderSettings.due_day_enabled
    ) {
      defaultReminders.push(
        createReminderFromSettings(
          "due_day",
          paymentReminderSettings
        )
      );
    }

    /*
     * AFTER
     */
    if (
      paymentReminderSettings.after_due_enabled
    ) {
      defaultReminders.push(
        createReminderFromSettings(
          "after",
          paymentReminderSettings
        )
      );
    }

    /*
     * Settings are defaults for NEW payments.
     *
     * They do not force enable_reminders.
     *
     * User still decides whether reminders
     * should be enabled for this payment.
     */
    setFormData((previous) => ({
      ...previous,

      reminders: defaultReminders,
    }));

    setHasInitializedReminderDefaults(true);
  }, [
    isEditMode,
    isReminderLoading,
    paymentReminderSettings,
    hasInitializedReminderDefaults,
  ]);


  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError(null);
  };


  /* =========================================================
     CREATE DEFAULT REMINDERS
  ========================================================= */

  const getSettingsDefaultReminders =
    (): PaymentReminderFormData[] => {
      if (!paymentReminderSettings) {
        return [];
      }

      const reminders: PaymentReminderFormData[] =
        [];

      if (
        paymentReminderSettings.before_due_enabled
      ) {
        reminders.push(
          createReminderFromSettings(
            "before",
            paymentReminderSettings
          )
        );
      }

      if (
        paymentReminderSettings.due_day_enabled
      ) {
        reminders.push(
          createReminderFromSettings(
            "due_day",
            paymentReminderSettings
          )
        );
      }

      if (
        paymentReminderSettings.after_due_enabled
      ) {
        reminders.push(
          createReminderFromSettings(
            "after",
            paymentReminderSettings
          )
        );
      }

      return reminders;
    };


  /* =========================================================
     REMINDER TOGGLE
  ========================================================= */

  const handleReminderToggle = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const enabled = event.target.checked;

    setFormData((previous) => ({
      ...previous,

      enable_reminders: enabled,

      /*
       * When enabled:
       *
       * If reminders already exist, preserve them.
       *
       * If no reminders exist, create defaults
       * from Settings.
       */
      reminders: enabled
        ? previous.reminders.length > 0
          ? previous.reminders
          : getSettingsDefaultReminders()
        : [],
    }));

    setValidationError(null);
  };


  /* =========================================================
     ADD REMINDER
  ========================================================= */

  const handleAddReminder = () => {
    if (formData.reminders.length >= 3) {
      setValidationError(
        "A maximum of 3 reminders can be configured."
      );
      return;
    }

    const existingTypes =
      formData.reminders.map(
        (reminder) =>
          reminder.reminder_type
      );

    const availableType =
      REMINDER_TYPES.find(
        (type) =>
          !existingTypes.includes(type)
      );

    if (!availableType) {
      setValidationError(
        "All reminder types are already configured."
      );
      return;
    }

    /*
     * New manually added reminder:
     *
     * Use current global Settings days as the
     * starting/default value.
     */
    const newReminder =
      paymentReminderSettings
        ? createReminderFromSettings(
            availableType,
            paymentReminderSettings
          )
        : {
            reminder_type: availableType,
            enabled: true,
            days_offset:
              availableType === "due_day"
                ? "0"
                : "1",
            message:
              getDefaultReminderMessage(
                availableType
              ),
          };

    setFormData((previous) => ({
      ...previous,

      reminders: [
        ...previous.reminders,
        newReminder,
      ],
    }));

    setValidationError(null);
  };


  /* =========================================================
     UPDATE REMINDER
  ========================================================= */

  const handleReminderChange = (
    index: number,
    field: keyof PaymentReminderFormData,
    value: string | boolean
  ) => {
    setFormData((previous) => {
      const reminders = [
        ...previous.reminders,
      ];

      if (!reminders[index]) {
        return previous;
      }

      reminders[index] = {
        ...reminders[index],
        [field]: value,
      };

      return {
        ...previous,
        reminders,
      };
    });

    setValidationError(null);
  };


  /* =========================================================
     REMOVE REMINDER
  ========================================================= */

  const handleRemoveReminder = (
    index: number
  ) => {
    setFormData((previous) => ({
      ...previous,

      reminders:
        previous.reminders.filter(
          (_, reminderIndex) =>
            reminderIndex !== index
        ),
    }));

    setValidationError(null);
  };


  /* =========================================================
     REMINDER TYPE CHANGE
  ========================================================= */

  const handleReminderTypeChange = (
    index: number,
    type: PaymentReminderType
  ) => {
    setFormData((previous) => {
      const reminders = [
        ...previous.reminders,
      ];

      if (!reminders[index]) {
        return previous;
      }

      /*
       * Use Settings days when changing type.
       */
      const settingsDays =
        paymentReminderSettings
          ? type === "before"
            ? paymentReminderSettings.before_due_days
            : type === "after"
              ? paymentReminderSettings.after_due_days
              : 0
          : type === "due_day"
            ? 0
            : 1;

      reminders[index] = {
        ...reminders[index],

        reminder_type: type,

        days_offset: String(
          settingsDays
        ),

        message:
          getDefaultReminderMessage(type),
      };

      return {
        ...previous,
        reminders,
      };
    });

    setValidationError(null);
  };


  /* =========================================================
     VALIDATE FORM
  ========================================================= */

  const validateForm = (): boolean => {
    if (!formData.client_id) {
      setValidationError(
        "Client is required."
      );
      return false;
    }

    if (!formData.payment_month) {
      setValidationError(
        "Payment month is required."
      );
      return false;
    }

    if (!formData.amount) {
      setValidationError(
        "Payment amount is required."
      );
      return false;
    }

    if (!formData.due_date) {
      setValidationError(
        "Due date is required."
      );
      return false;
    }

    const amount = Number(
      formData.amount
    );

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setValidationError(
        "Payment amount must be a valid non-negative number."
      );
      return false;
    }

    /*
     * Reminders disabled:
     *
     * The API validation expects reminders to be
     * omitted when enable_reminders is false.
     */
    if (!formData.enable_reminders) {
      return true;
    }

    if (formData.reminders.length === 0) {
      setValidationError(
        "At least one reminder is required when reminders are enabled."
      );
      return false;
    }

    if (formData.reminders.length > 3) {
      setValidationError(
        "A maximum of 3 reminders can be configured."
      );
      return false;
    }

    const reminderTypes =
      formData.reminders.map(
        (reminder) =>
          reminder.reminder_type
      );

    if (
      new Set(reminderTypes).size !==
      reminderTypes.length
    ) {
      setValidationError(
        "Each reminder type can only be configured once."
      );
      return false;
    }

    for (
      let index = 0;
      index < formData.reminders.length;
      index++
    ) {
      const reminder =
        formData.reminders[index];

      if (!reminder.message.trim()) {
        setValidationError(
          `Reminder ${index + 1} message cannot be empty.`
        );
        return false;
      }

      if (
        reminder.message.trim().length >
        5000
      ) {
        setValidationError(
          `Reminder ${index + 1} message cannot exceed 5000 characters.`
        );
        return false;
      }

      if (
        reminder.reminder_type ===
          "before" ||
        reminder.reminder_type ===
          "after"
      ) {
        if (!reminder.days_offset) {
          setValidationError(
            `Reminder ${index + 1} days are required.`
          );
          return false;
        }

        const days = Number(
          reminder.days_offset
        );

        if (
          !Number.isFinite(days) ||
          !Number.isInteger(days) ||
          days < 1
        ) {
          setValidationError(
            reminder.reminder_type ===
              "before"
              ? "Before reminder must be at least 1 day before."
              : "After reminder must be at least 1 day after."
          );
          return false;
        }
      }

      if (
        reminder.reminder_type ===
        "due_day"
      ) {
        if (
          reminder.days_offset !== "" &&
          Number(
            reminder.days_offset
          ) !== 0
        ) {
          setValidationError(
            "Due day reminder offset must be 0."
          );
          return false;
        }
      }
    }

    return true;
  };


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setValidationError(null);

    if (!validateForm()) {
      return;
    }

    const amount = Number(
      formData.amount
    );

    /*
     * When reminders are disabled, do NOT send
     * `reminders: []`.
     *
     * Backend validation expects reminders to be
     * omitted when enable_reminders is false.
     */
    const reminders =
      formData.enable_reminders
        ? formData.reminders.map(
            (reminder) => ({
              reminder_type:
                reminder.reminder_type,

              enabled:
                reminder.enabled,

              days_offset:
                reminder.reminder_type ===
                "due_day"
                  ? 0
                  : Number(
                      reminder.days_offset
                    ),

              message:
                reminder.message.trim(),
            })
          )
        : undefined;


    /* =======================================================
       EDIT
    ======================================================= */

    if (props.mode === "edit") {
      const payload: UpdatePaymentPayload = {
        payment_month:
          formData.payment_month,

        amount,

        due_date:
          formData.due_date,

        status:
          formData.status,

        enable_reminders:
          formData.enable_reminders,

        reminders,
      };

      props.onSubmit?.(payload);

      return;
    }


    /* =======================================================
       CREATE
    ======================================================= */

    const payload: CreatePaymentPayload = {
      client_id:
        Number(formData.client_id),

      payment_month:
        formData.payment_month,

      amount,

      due_date:
        formData.due_date,

      status:
        formData.status,

      enable_reminders:
        formData.enable_reminders,

      reminders,
    };

    props.onSubmit?.(payload);
  };


  /* =========================================================
     AVAILABLE REMINDER TYPES
  ========================================================= */

  const selectedReminderTypes =
    formData.reminders.map(
      (reminder) =>
        reminder.reminder_type
    );

  const canAddReminder =
    formData.reminders.length < 3 &&
    REMINDER_TYPES.some(
      (type) =>
        !selectedReminderTypes.includes(
          type
        )
    );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[700px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {isEditMode
                  ? "Edit Payment"
                  : "Add Payment"}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
                {isEditMode
                  ? "Update the payment information and reminder settings."
                  : "Add a payment for the selected client and configure reminders."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              disabled={isLoading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {(validationError || error) && (
          <div className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-2.5 text-[10px] text-red-600 sm:px-6">
            {validationError || error}
          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-3.5 px-5 py-4 sm:px-6">

            {/* =================================================
                CLIENT
            ================================================= */}

            <SelectField
              label="Client"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              disabled={
                isLoading ||
                isEditMode
              }
            >
              <option value="">
                Select client
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                </option>
              ))}
            </SelectField>


            {/* =================================================
                PAYMENT MONTH + STATUS
            ================================================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField
                label="Payment month"
                name="payment_month"
                type="month"
                value={
                  formData.payment_month
                }
                onChange={handleChange}
                disabled={isLoading}
              />

              <SelectField
                label="Payment status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="due">
                  Due
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="overdue">
                  Overdue
                </option>
              </SelectField>
            </div>


            {/* =================================================
                AMOUNT + DUE DATE
            ================================================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField
                label="Payment amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="50000.00"
                value={formData.amount}
                onChange={handleChange}
                disabled={isLoading}
              />

              <FormField
                label="Due date"
                name="due_date"
                type="date"
                value={
                  formData.due_date
                }
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>


            {/* =================================================
                REMINDER TOGGLE
            ================================================= */}

            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-700">
                    Payment reminders
                  </p>

                  <p className="mt-0.5 text-[8px] leading-relaxed text-slate-400">
                    Enable automatic reminders for this payment.
                  </p>
                </div>

                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={
                      formData.enable_reminders
                    }
                    onChange={
                      handleReminderToggle
                    }
                    disabled={
                      isLoading ||
                      isReminderLoading
                    }
                    className="peer sr-only"
                  />

                  <div className="h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-[#2E3192] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2E3192]/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    <div className="h-5 w-5 rounded-full border border-slate-200 bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              </div>
            </div>


            {/* =================================================
                REMINDERS
            ================================================= */}

            {formData.enable_reminders && (
              <div className="space-y-3">

                {/* REMINDER HEADER */}

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-[10px] font-semibold text-slate-700">
                      Reminder configuration
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      Configure up to 3 payment reminders.
                    </p>
                  </div>

                  {canAddReminder && (
                    <button
                      type="button"
                      onClick={
                        handleAddReminder
                      }
                      disabled={
                        isLoading ||
                        isReminderLoading
                      }
                      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[9px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus
                        size={13}
                        strokeWidth={1.8}
                      />

                      Add reminder
                    </button>
                  )}
                </div>


                {/* =================================================
                    REMINDER CARDS
                ================================================= */}

                {formData.reminders.map(
                  (reminder, index) => (
                    <div
                      key={`${reminder.reminder_type}-${index}`}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.02)]"
                    >

                      {/* CARD HEADER */}

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-[10px] font-semibold text-slate-700">
                            Reminder {index + 1}
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {
                              reminderDescriptions[
                                reminder.reminder_type
                              ]
                            }
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveReminder(
                              index
                            )
                          }
                          disabled={isLoading}
                          aria-label="Remove reminder"
                          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={13}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>


                      {/* TYPE + DAYS */}

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div>
                          <FormLabel>
                            Reminder type
                          </FormLabel>

                          <select
                            value={
                              reminder.reminder_type
                            }
                            onChange={(
                              event
                            ) =>
                              handleReminderTypeChange(
                                index,
                                event.target
                                  .value as PaymentReminderType
                              )
                            }
                            disabled={
                              isLoading
                            }
                            className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            {REMINDER_TYPES.map(
                              (type) => {
                                const isUsedByOther =
                                  selectedReminderTypes.includes(
                                    type
                                  ) &&
                                  type !==
                                    reminder.reminder_type;

                                return (
                                  <option
                                    key={type}
                                    value={type}
                                    disabled={
                                      isUsedByOther
                                    }
                                  >
                                    {
                                      reminderLabels[
                                        type
                                      ]
                                    }
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>


                        <FormField
                          label={
                            reminder.reminder_type ===
                            "due_day"
                              ? "Days offset"
                              : reminder.reminder_type ===
                                  "before"
                                ? "Days before"
                                : "Days after"
                          }
                          name={`reminder-${index}-days`}
                          type="number"
                          min={
                            reminder.reminder_type ===
                            "due_day"
                              ? "0"
                              : "1"
                          }
                          step="1"
                          value={
                            reminder.reminder_type ===
                            "due_day"
                              ? "0"
                              : reminder.days_offset
                          }
                          disabled={
                            isLoading ||
                            reminder.reminder_type ===
                              "due_day"
                          }
                          onChange={(
                            event
                          ) =>
                            handleReminderChange(
                              index,
                              "days_offset",
                              event.target
                                .value
                            )
                          }
                        />
                      </div>


                      {/* ENABLE + MESSAGE */}

                      <div className="mt-3">

                        <div className="mb-2 flex items-center justify-between gap-3">

                          <FormLabel>
                            Reminder message
                          </FormLabel>

                          <label className="flex cursor-pointer items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={
                                reminder.enabled
                              }
                              onChange={(
                                event
                              ) =>
                                handleReminderChange(
                                  index,
                                  "enabled",
                                  event.target
                                    .checked
                                )
                              }
                              disabled={
                                isLoading
                              }
                              className="h-3 w-3 rounded border-slate-300 text-[#2E3192] focus:ring-[#2E3192]/20"
                            />

                            <span className="text-[8px] font-medium text-slate-500">
                              Enabled
                            </span>
                          </label>
                        </div>

                        <textarea
                          value={
                            reminder.message
                          }
                          onChange={(event) =>
                            handleReminderChange(
                              index,
                              "message",
                              event.target
                                .value
                            )
                          }
                          placeholder="Enter reminder message..."
                          rows={3}
                          maxLength={5000}
                          disabled={isLoading}
                          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="text-[8px] text-slate-400">
                            You can use{" "}
                            <span className="font-medium text-slate-500">
                              {"{{days}}"}
                            </span>{" "}
                            for the reminder day value.
                          </p>

                          <span className="shrink-0 text-[8px] text-slate-400">
                            {reminder.message.length}/5000
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}


                {/* EMPTY REMINDER */}

                {formData.reminders.length ===
                  0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">

                    <p className="text-[9px] font-medium text-slate-500">
                      No reminders configured
                    </p>

                    <p className="mt-1 text-[8px] text-slate-400">
                      Add at least one reminder to enable payment reminders.
                    </p>

                    {canAddReminder && (
                      <button
                        type="button"
                        onClick={
                          handleAddReminder
                        }
                        disabled={
                          isLoading ||
                          isReminderLoading
                        }
                        className="mt-3 inline-flex h-7 items-center gap-1.5 rounded-md bg-[#2E3192] px-2.5 text-[9px] font-semibold text-white transition hover:bg-[#27297f] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus
                          size={13}
                          strokeWidth={1.8}
                        />

                        Add reminder
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}


            {/* =================================================
                INFO
            ================================================= */}

            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">

              <p className="text-[9px] font-medium text-slate-500">
                {isEditMode
                  ? "Payment information"
                  : "Payment setup"}
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
                {isEditMode
                  ? "Update the payment details and reminder configuration as required."
                  : "Payment reminders can be configured before, on, or after the due date."}
              </p>
            </div>
          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-5 py-3 sm:px-6">
            <div className="flex items-center justify-end gap-2">

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  (!isEditMode &&
                    isReminderLoading)
                }
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2E3192] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Saving..."
                  : isEditMode
                    ? "Update Payment"
                    : "Add Payment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  disabled?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

function FormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  min,
  step,
  disabled = false,
  onChange,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <FormLabel>
        {label}
      </FormLabel>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        min={min}
        step={step}
        disabled={disabled}
        onChange={onChange}
        className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}


/* =========================================================
   SELECT FIELD
========================================================= */

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  onChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
}

function SelectField({
  label,
  name,
  value,
  disabled = false,
  children,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="min-w-0">
      <FormLabel>
        {label}
      </FormLabel>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        {children}
      </select>
    </div>
  );
}


/* =========================================================
   FORM LABEL
========================================================= */

function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[9px] font-medium text-slate-500">
      {children}
    </label>
  );
}