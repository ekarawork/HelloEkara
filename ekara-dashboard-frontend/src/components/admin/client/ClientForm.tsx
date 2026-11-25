"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { ClientServiceName } from "@/src/types/admin/client.types";

/* TYPES */
export interface ClientServiceFormData {
  service_name: ClientServiceName;
  monthly_budget: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  login_id: string;
  password: string;
  monthly_service_fee: string;
  website_url: string;
  instagram_url: string;
  facebook_url: string;
  linkedin_url: string;
  youtube_url: string;
  profile_photo: File | null;
  agreement_contract: File | null;
  meta_ads_budget: string;
  google_ads_budget: string;
  website_sales_budget: string;
  organic_social_budget: string;
  services: ClientServiceFormData[];
}

interface ClientFormProps {
  mode?: "add" | "edit";
  initialData?: Partial<ClientFormData>;
  onClose?: () => void;
  onSubmit?: (data: ClientFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

/* CONSTANTS */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_PDF_TYPES = ["application/pdf"];

/* SERVICE OPTIONS */
const serviceOptions: {
  id: ClientServiceName;
  label: string;
  description: string;
}[] = [
  {
    id: "META_ADS",
    label: "Meta Ads",
    description: "Daily spend, impressions, clicks and leads",
  },
  {
    id: "GOOGLE_ADS",
    label: "Google Ads",
    description: "Daily spend, impressions, clicks and leads",
  },
  {
    id: "WEBSITE_SALES",
    label: "Website Sales",
    description: "Daily sales, revenue and ROAS",
  },
  {
    id: "ORGANIC_SOCIAL",
    label: "Organic Social",
    description: "Daily views, reach and followers",
  },
];

/* COMPONENT */
export default function ClientForm({
  mode = "add",
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: ClientFormProps) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    login_id: "",
    password: "",
    monthly_service_fee: "",
    website_url: "",
    instagram_url: "",
    facebook_url: "",
    linkedin_url: "",
    youtube_url: "",
    profile_photo: null,
    agreement_contract: null,
    meta_ads_budget: "",
    google_ads_budget: "",
    website_sales_budget: "",
    organic_social_budget: "",
    services: [],
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  /* EXISTING PROFILE PHOTO */
  useEffect(() => {
    // If edit mode provides an existing URL separately, parent can control preview through initialData handling. Do not create object URLs for existing strings here.
  }, []);

  /* CLEANUP PREVIEW URL */
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  /* INPUT CHANGE */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError(null);
  };

  /* PROFILE PHOTO */
  const handleProfilePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // File type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setValidationError("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    // File size validation
    if (file.size > MAX_IMAGE_SIZE) {
      setValidationError("Profile photo must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    setValidationError(null);

    setFormData((previous) => ({
      ...previous,
      profile_photo: file,
    }));

    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
  };

  /* AGREEMENT CONTRACT */
  const handleAgreement = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // PDF validation
    if (!ALLOWED_PDF_TYPES.includes(file.type)) {
      setValidationError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    // PDF size validation
    if (file.size > MAX_PDF_SIZE) {
      setValidationError("Agreement contract must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    setValidationError(null);

    setFormData((previous) => ({
      ...previous,
      agreement_contract: file,
    }));
  };

  /* TOGGLE SERVICE */
  const toggleService = (serviceId: ClientServiceName) => {
    setFormData((previous) => {
      const alreadySelected = previous.services.some(
        (service) => service.service_name === serviceId
      );

      if (alreadySelected) {
        return {
          ...previous,
          services: previous.services.filter(
            (service) => service.service_name !== serviceId
          ),
        };
      }

      let monthlyBudget = "";

      switch (serviceId) {
        case "META_ADS":
          monthlyBudget = previous.meta_ads_budget;
          break;
        case "GOOGLE_ADS":
          monthlyBudget = previous.google_ads_budget;
          break;
        case "WEBSITE_SALES":
          monthlyBudget = previous.website_sales_budget;
          break;
        case "ORGANIC_SOCIAL":
          monthlyBudget = previous.organic_social_budget;
          break;
      }

      return {
        ...previous,
        services: [
          ...previous.services,
          {
            service_name: serviceId,
            monthly_budget: monthlyBudget || "0",
          },
        ],
      };
    });
  };

  /* SUBMIT */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    // Build services payload
    const services = formData.services.map((service) => {
      let monthlyBudget = "";

      switch (service.service_name) {
        case "META_ADS":
          monthlyBudget = formData.meta_ads_budget;
          break;
        case "GOOGLE_ADS":
          monthlyBudget = formData.google_ads_budget;
          break;
        case "WEBSITE_SALES":
          monthlyBudget = formData.website_sales_budget;
          break;
        case "ORGANIC_SOCIAL":
          monthlyBudget = formData.organic_social_budget;
          break;
      }

      return {
        service_name: service.service_name,
        monthly_budget: monthlyBudget === "" ? 0 : Number(monthlyBudget),
      };
    });

    // Validate service name
    const hasInvalidService = services.some((service) => !service.service_name);

    if (hasInvalidService) {
      setValidationError("Service name is required.");
      return;
    }

    // Validate budget
    const hasInvalidBudget = services.some(
      (service) =>
        Number.isNaN(service.monthly_budget) || service.monthly_budget < 0
    );

    if (hasInvalidBudget) {
      setValidationError("Monthly service budget must be a valid number.");
      return;
    }

    // Submit payload
    const payload: ClientFormData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      login_id: formData.login_id.trim(),
      monthly_service_fee: formData.monthly_service_fee,
      services: services.map((service) => ({
        service_name: service.service_name,
        monthly_budget: String(service.monthly_budget),
      })),
    };

    onSubmit?.(payload);
  };

  /* RENDER */
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[700px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">
        {/* HEADER */}
        <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {isEditMode ? "Edit Client" : "Add New Client"}
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
                {isEditMode
                  ? "Update the client profile, services, budgets and agreement record."
                  : "Create the client profile, services, budgets and agreement record."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              disabled={isLoading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} strokeWidth={1.8} />
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
        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-3.5 px-5 py-4 sm:px-6">
            {/* Client Name + Email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Client name"
                name="name"
                placeholder="Client name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormField
                label="Client email"
                name="email"
                type="email"
                placeholder="Client email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Login ID + Password */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Client login ID"
                name="login_id"
                placeholder="client"
                value={formData.login_id}
                onChange={handleChange}
                autoComplete="off"
              />
              <FormField
                label={isEditMode ? "New password (optional)" : "Temporary password"}
                name="password"
                type="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* Monthly Service Fee */}
            <FormField
              label="Monthly service fee"
              name="monthly_service_fee"
              type="number"
              placeholder="25000"
              value={formData.monthly_service_fee}
              onChange={handleChange}
            />

            {/* PROFILE PHOTO */}
            <div>
              <FormLabel>Profile photo</FormLabel>
              <div className="mt-1.5 flex min-h-[56px] items-center gap-3 rounded-lg border border-slate-200 px-2.5 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[9px] font-medium text-slate-400">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={15} strokeWidth={1.6} />
                  )}
                </div>

                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50">
                  <Upload size={13} strokeWidth={1.7} />
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfilePhoto}
                    className="hidden"
                  />
                </label>

                <span className="min-w-0 truncate text-[10px] text-slate-400">
                  {formData.profile_photo?.name || "No file chosen"}
                </span>
              </div>
              <p className="mt-1 text-[8px] text-slate-400">
                JPG, PNG or WebP · max 10 MB
              </p>
            </div>

            {/* Website */}
            <FormField
              label="Website URL"
              name="website_url"
              placeholder="https://..."
              value={formData.website_url}
              onChange={handleChange}
            />

            {/* Instagram + Facebook */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Instagram URL"
                name="instagram_url"
                placeholder="https://instagram.com/..."
                value={formData.instagram_url}
                onChange={handleChange}
              />
              <FormField
                label="Facebook URL"
                name="facebook_url"
                placeholder="https://facebook.com/..."
                value={formData.facebook_url}
                onChange={handleChange}
              />
            </div>

            {/* LinkedIn + YouTube */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="LinkedIn URL"
                name="linkedin_url"
                placeholder="https://linkedin.com/company/..."
                value={formData.linkedin_url}
                onChange={handleChange}
              />
              <FormField
                label="YouTube URL"
                name="youtube_url"
                placeholder="https://youtube.com/@..."
                value={formData.youtube_url}
                onChange={handleChange}
              />
            </div>

            {/* AGREEMENT */}
            <div>
              <FormLabel>Agreement / contract</FormLabel>
              <label className="mt-1.5 flex h-9 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-2 transition hover:bg-slate-50">
                <span className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-medium text-slate-600">
                  Choose file
                </span>
                <span className="ml-2 truncate text-[10px] text-slate-400">
                  {formData.agreement_contract?.name || "No file chosen"}
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleAgreement}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-[8px] text-slate-400">
                PDF only · max 10 MB
              </p>
            </div>

            {/* SERVICES */}
            <div>
              <FormLabel>Services</FormLabel>
              <div className="mt-1.5 space-y-1.5">
                {serviceOptions.map((service) => {
                  const isSelected = formData.services.some(
                    (selectedService) =>
                      selectedService.service_name === service.id
                  );

                  return (
                    <button
                      key={service.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => toggleService(service.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                        isSelected
                          ? "border-[#B9BAFF] bg-[#F8F8FF]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition ${
                          isSelected
                            ? "border-[#2E3192] bg-[#2E3192]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-800">
                          {service.label}
                        </p>
                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {service.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SERVICE BUDGETS */}
            {formData.services.length > 0 && (
              <div>
                <FormLabel>Monthly service budgets</FormLabel>
                <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {formData.services.some(
                    (service) => service.service_name === "META_ADS"
                  ) && (
                    <FormField
                      label="Meta Ads budget"
                      name="meta_ads_budget"
                      type="number"
                      placeholder="50000"
                      value={formData.meta_ads_budget}
                      onChange={handleChange}
                    />
                  )}

                  {formData.services.some(
                    (service) => service.service_name === "GOOGLE_ADS"
                  ) && (
                    <FormField
                      label="Google Ads budget"
                      name="google_ads_budget"
                      type="number"
                      placeholder="50000"
                      value={formData.google_ads_budget}
                      onChange={handleChange}
                    />
                  )}

                  {formData.services.some(
                    (service) => service.service_name === "WEBSITE_SALES"
                  ) && (
                    <FormField
                      label="Website Sales budget"
                      name="website_sales_budget"
                      type="number"
                      placeholder="50000"
                      value={formData.website_sales_budget}
                      onChange={handleChange}
                    />
                  )}

                  {formData.services.some(
                    (service) => service.service_name === "ORGANIC_SOCIAL"
                  ) && (
                    <FormField
                      label="Organic Social budget"
                      name="organic_social_budget"
                      type="number"
                      placeholder="25000"
                      value={formData.organic_social_budget}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            )}
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
                    ? "Update Client"
                    : "Create Client"}
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
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  autoComplete,
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
        autoComplete={autoComplete}
        onChange={onChange}
        className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
      />
    </div>
  );
}

/* FORM LABEL */
function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[9px] font-medium text-slate-500">
      {children}
    </label>
  );
}