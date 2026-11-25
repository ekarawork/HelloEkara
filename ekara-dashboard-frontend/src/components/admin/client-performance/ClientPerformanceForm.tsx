"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { X } from "lucide-react";

import {
  CreateClientPerformancePayload,
  UpdateClientPerformancePayload,
} from "@/src/types/admin/clientPerformance.types";

/* TYPES */

export interface ClientPerformanceFormData {
  client_id: string;
  client_service_id: string;
  performance_date: string;
  daily_spend: string;
  impressions: string;
  clicks: string;
  leads: string;
}

interface BaseClientPerformanceFormProps {
  clients?: ClientOption[];
  services?: ClientServiceOption[];
  onClose?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface CreateClientPerformanceFormProps
  extends BaseClientPerformanceFormProps {
  mode?: "add";
  initialData?: undefined;
  onSubmit?: (
    data: CreateClientPerformancePayload
  ) => void;
}

interface UpdateClientPerformanceFormProps
  extends BaseClientPerformanceFormProps {
  mode: "edit";
  initialData?: Partial<ClientPerformanceFormData>;
  onSubmit?: (
    data: UpdateClientPerformancePayload
  ) => void;
}

type ClientPerformanceFormProps =
  | CreateClientPerformanceFormProps
  | UpdateClientPerformanceFormProps;

export interface ClientOption {
  id: number;
  uuid: string;
  name: string;
}

export interface ClientServiceOption {
  id: number;
  uuid: string;
  client_id: number;
  service_name: string;
  monthly_budget: number;
}

/* SERVICE LABELS */

const serviceLabels: Record<string, string> = {
  META_ADS: "Meta Ads",
  GOOGLE_ADS: "Google Ads",
  WEBSITE_SALES: "Website Sales",
  ORGANIC_SOCIAL: "Organic Social",
};

/* COMPONENT */

export default function ClientPerformanceForm(
  props: ClientPerformanceFormProps
) {
  const {
    initialData,
    clients = [],
    services = [],
    onClose,
    isLoading = false,
    error = null,
  } = props;

  const mode = props.mode ?? "add";
  const isEditMode = mode === "edit";

  const [formData, setFormData] =
    useState<ClientPerformanceFormData>({
      client_id: "",
      client_service_id: "",
      performance_date: "",
      daily_spend: "0",
      impressions: "0",
      clicks: "0",
      leads: "0",
    });

  const [validationError, setValidationError] =
    useState<string | null>(null);

  /* INITIAL DATA */

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      ...initialData,
    }));
  }, [initialData]);

  /* INPUT CHANGE */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError(null);

    /* Reset service when client changes */

    if (name === "client_id") {
      setFormData((previous) => ({
        ...previous,
        client_id: value,
        client_service_id: "",
      }));
    }
  };

  /* SUBMIT */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setValidationError(null);

    /* Required fields */

    if (!formData.client_id) {
      setValidationError("Client is required.");
      return;
    }

    if (!formData.client_service_id) {
      setValidationError("Client service is required.");
      return;
    }

    if (!formData.performance_date) {
      setValidationError("Performance date is required.");
      return;
    }

    /* Numeric validation */

    const dailySpend = Number(formData.daily_spend);
    const impressions = Number(formData.impressions);
    const clicks = Number(formData.clicks);
    const leads = Number(formData.leads);

    if (
      Number.isNaN(dailySpend) ||
      dailySpend < 0
    ) {
      setValidationError(
        "Daily spend must be a valid non-negative number."
      );
      return;
    }

    if (
      Number.isNaN(impressions) ||
      impressions < 0 ||
      !Number.isInteger(impressions)
    ) {
      setValidationError(
        "Impressions must be a valid non-negative whole number."
      );
      return;
    }

    if (
      Number.isNaN(clicks) ||
      clicks < 0 ||
      !Number.isInteger(clicks)
    ) {
      setValidationError(
        "Clicks must be a valid non-negative whole number."
      );
      return;
    }

    if (
      Number.isNaN(leads) ||
      leads < 0 ||
      !Number.isInteger(leads)
    ) {
      setValidationError(
        "Leads must be a valid non-negative whole number."
      );
      return;
    }

    /* Logical validation */

    if (clicks > impressions) {
      setValidationError(
        "Clicks cannot be greater than impressions."
      );
      return;
    }

    if (leads > clicks) {
      setValidationError(
        "Leads cannot be greater than clicks."
      );
      return;
    }

    /* Payload */

/* PAYLOAD */

/* PAYLOAD */

if (props.mode === "edit") {
  const payload: UpdateClientPerformancePayload = {
    performance_date: formData.performance_date,
    daily_spend: dailySpend,
    impressions,
    clicks,
    leads,
  };

  props.onSubmit?.(payload);
  return;
}

const payload: CreateClientPerformancePayload = {
  client_id: Number(formData.client_id),
  client_service_id: Number(formData.client_service_id),
  performance_date: formData.performance_date,
  daily_spend: dailySpend,
  impressions,
  clicks,
  leads,
};

props.onSubmit?.(payload);
  };

  /* FILTER SERVICES BY CLIENT */

  const filteredServices = formData.client_id
    ? services.filter(
        (service) =>
          Number(service.client_id) ===
          Number(formData.client_id)
      )
    : [];

  /* RENDER */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[700px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">

        {/* HEADER */}

        <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {isEditMode
                  ? "Edit Performance"
                  : "Add Daily Performance"}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
                {isEditMode
                  ? "Update the client's daily performance data."
                  : "Add daily performance data for the selected client service."}
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

        {/* ERROR */}

        {(validationError || error) && (
          <div className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-2.5 text-[10px] text-red-600 sm:px-6">
            {validationError || error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-3.5 px-5 py-4 sm:px-6">

            {/* CLIENT + SERVICE */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* CLIENT */}

              <SelectField
                label="Client"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                disabled={isLoading || isEditMode}
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

              {/* SERVICE */}

              <SelectField
                label="Client service"
                name="client_service_id"
                value={formData.client_service_id}
                onChange={handleChange}
                disabled={
                  isLoading ||
                  isEditMode ||
                  !formData.client_id
                }
              >
                <option value="">
                  {formData.client_id
                    ? "Select service"
                    : "Select client first"}
                </option>

                {filteredServices.map(
                  (service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {serviceLabels[
                        service.service_name
                      ] ||
                        service.service_name}
                    </option>
                  )
                )}
              </SelectField>
            </div>

            {/* PERFORMANCE DATE */}

            <FormField
              label="Performance date"
              name="performance_date"
              type="date"
              value={
                formData.performance_date
              }
              onChange={handleChange}
              disabled={isLoading}
            />

            {/* DAILY SPEND */}

            <FormField
              label="Daily ad spend"
              name="daily_spend"
              type="number"
              min="0"
              step="0.01"
              placeholder="5000.00"
              value={formData.daily_spend}
              onChange={handleChange}
              disabled={isLoading}
            />

            {/* IMPRESSIONS + CLICKS */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField
                label="Impressions / Views"
                name="impressions"
                type="number"
                min="0"
                step="1"
                placeholder="10000"
                value={formData.impressions}
                onChange={handleChange}
                disabled={isLoading}
              />

              <FormField
                label="Clicks"
                name="clicks"
                type="number"
                min="0"
                step="1"
                placeholder="500"
                value={formData.clicks}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* LEADS */}

            <FormField
              label="Leads"
              name="leads"
              type="number"
              min="0"
              step="1"
              placeholder="50"
              value={formData.leads}
              onChange={handleChange}
              disabled={isLoading}
            />

            {/* INFO */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
              <p className="text-[9px] font-medium text-slate-500">
                {isEditMode
                  ? "Edit 2 of 2."
                  : "Performance data"}
              </p>

              <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
                {isEditMode
                  ? "After the second edit this record becomes locked."
                  : "Once saved, this record can be edited up to 2 times."}
              </p>
            </div>
          </div>

          {/* FOOTER */}

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
                disabled={isLoading}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2E3192] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Saving..."
                  : isEditMode
                    ? "Update Performance"
                    : "Add Performance"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* FORM FIELD */

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
      <FormLabel>{label}</FormLabel>

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

/* SELECT FIELD */

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
      <FormLabel>{label}</FormLabel>

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

/* FORM LABEL */

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