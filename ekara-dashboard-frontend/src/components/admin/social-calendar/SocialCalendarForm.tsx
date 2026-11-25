"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Loader2 } from "lucide-react";

import {
  SocialCalendarPost,
  CreateSocialCalendarPostPayload,
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/admin/socialCalendar.types";

/* ========================= TYPES ========================= */

interface SocialCalendarClientOption {
  id: number;
  uuid: string;
  name: string;
}

interface SocialCalendarFormProps {
  mode?: "create" | "edit";

  post?: SocialCalendarPost | null;

  clients?: SocialCalendarClientOption[];

  isLoading?: boolean;

  defaultPostDate?: string;

  onSubmit: (
    payload: CreateSocialCalendarPostPayload
  ) => void | Promise<void>;

  onCancel: () => void;
}

/* ========================= OPTIONS ========================= */

const PLATFORM_OPTIONS: {
  value: SocialCalendarPlatform;
  label: string;
}[] = [
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
];

const CONTENT_TYPE_OPTIONS: {
  value: SocialCalendarContentType;
  label: string;
}[] = [
  {
    value: "post",
    label: "Post",
  },
  {
    value: "reel",
    label: "Reel",
  },
  {
    value: "carousel",
    label: "Carousel",
  },
  {
    value: "story",
    label: "Story",
  },
];

const STATUS_OPTIONS: {
  value: SocialCalendarStatus;
  label: string;
}[] = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "published",
    label: "Published",
  },
];

/* ========================= HELPERS ========================= */

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* ========================= COMPONENT ========================= */

export default function SocialCalendarForm({
  mode = "create",
  post = null,
  clients = [],
  isLoading = false,
  defaultPostDate,
  onSubmit,
  onCancel,
}: SocialCalendarFormProps) {
  const [clientId, setClientId] = useState<string>("");
  const [postDate, setPostDate] =
    useState<string>(getTodayDate());

  const [platform, setPlatform] =
    useState<SocialCalendarPlatform>("instagram");

  const [contentType, setContentType] =
    useState<SocialCalendarContentType>("post");

  const [status, setStatus] =
    useState<SocialCalendarStatus>("draft");

  const [note, setNote] = useState<string>("");

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  /* ========================= INITIALIZE FORM ========================= */

useEffect(() => {
  if (mode === "edit" && post) {
    setClientId(String(post.client_id));

    setPostDate(
      post.post_date?.slice(0, 10) ||
        getTodayDate()
    );

    setPlatform(post.platform);
    setContentType(post.content_type);
    setStatus(post.status);
    setNote(post.note || "");

    setErrors({});
    return;
  }

  setClientId("");
  setPostDate(
    defaultPostDate || getTodayDate()
  );
  setPlatform("instagram");
  setContentType("post");
  setStatus("draft");
  setNote("");
  setErrors({});
}, [mode, post, defaultPostDate]);
  /* ========================= VALIDATION ========================= */

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientId) {
      newErrors.client_id = "Client is required.";
    }

    if (!postDate) {
      newErrors.post_date = "Post date is required.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
      newErrors.post_date =
        "Post date must be in YYYY-MM-DD format.";
    }

    if (!platform) {
      newErrors.platform = "Platform is required.";
    }

    if (!contentType) {
      newErrors.content_type =
        "Content type is required.";
    }

    if (!status) {
      newErrors.status = "Status is required.";
    }

    if (note.length > 5000) {
      newErrors.note =
        "Note cannot be longer than 5000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ========================= SUBMIT ========================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateSocialCalendarPostPayload = {
      client_id: Number(clientId),
      post_date: postDate,
      platform,
      content_type: contentType,
      status,
      note: note.trim() || undefined,
    };

    await onSubmit(payload);
  };

  /* ========================= ERROR CLEAR ========================= */

  const clearError = (fieldName: string) => {
    if (!errors[fieldName]) {
      return;
    }

    setErrors((previous) => ({
      ...previous,
      [fieldName]: "",
    }));
  };

  /* ========================= RENDER ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* ========================= FORM CONTENT ========================= */}

      <div className="space-y-3.5">
        {/* ========================= CLIENT + DATE ========================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* CLIENT */}

          <SelectField
            label="Client"
            name="client_id"
            value={clientId}
            onChange={(event) => {
              setClientId(event.target.value);
              clearError("client_id");
            }}
            disabled={isLoading}
            error={errors.client_id}
            required
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

          {/* POST DATE */}

          <FormField
            label="Post date"
            name="post_date"
            type="date"
            value={postDate}
            onChange={(event) => {
              setPostDate(event.target.value);
              clearError("post_date");
            }}
            disabled={isLoading}
            error={errors.post_date}
            required
          />
        </div>

        {/* ========================= PLATFORM + CONTENT TYPE ========================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* PLATFORM */}

          <SelectField
            label="Platform"
            name="platform"
            value={platform}
            onChange={(event) => {
              setPlatform(
                event.target.value as SocialCalendarPlatform
              );

              clearError("platform");
            }}
            disabled={isLoading}
            error={errors.platform}
            required
          >
            {PLATFORM_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </SelectField>

          {/* CONTENT TYPE */}

          <SelectField
            label="Content type"
            name="content_type"
            value={contentType}
            onChange={(event) => {
              setContentType(
                event.target.value as SocialCalendarContentType
              );

              clearError("content_type");
            }}
            disabled={isLoading}
            error={errors.content_type}
            required
          >
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>

        {/* ========================= STATUS ========================= */}

        <SelectField
          label="Status"
          name="status"
          value={status}
          onChange={(event) => {
            setStatus(
              event.target.value as SocialCalendarStatus
            );

            clearError("status");
          }}
          disabled={isLoading}
          error={errors.status}
          required
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </SelectField>

        {/* ========================= NOTE ========================= */}

        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <FormLabel>
              Note
            </FormLabel>

            <span className="text-[8px] text-slate-400">
              {note.length}/5000
            </span>
          </div>

          <textarea
            id="note"
            name="note"
            rows={4}
            value={note}
            maxLength={5000}
            onChange={(event) => {
              setNote(event.target.value);
              clearError("note");
            }}
            disabled={isLoading}
            placeholder="Add notes about this social media post..."
            className={`mt-1.5 min-h-[90px] w-full resize-none rounded-lg border bg-white px-2.5 py-2 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 ${
              errors.note
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
            } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
          />

          {errors.note && (
            <p className="mt-1 text-[9px] text-red-500">
              {errors.note}
            </p>
          )}
        </div>

        {/* ========================= INFO ========================= */}

        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <p className="text-[9px] font-medium text-slate-500">
            Social calendar post
          </p>

          <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
            {mode === "edit"
              ? "Update the selected social media post details and save the changes."
              : "Create a social media post for the selected client and manage its publishing status."}
          </p>
        </div>
      </div>

      {/* ========================= FOOTER ========================= */}

      <div className="sticky bottom-0 mt-3.5 border-t border-slate-100 bg-white px-0 py-3">
        <div className="flex items-center justify-end gap-2">
          {/* CANCEL */}

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2E3192] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <Loader2
                size={13}
                strokeWidth={2}
                className="animate-spin"
              />
            )}

            {isLoading
              ? mode === "edit"
                ? "Updating..."
                : "Saving..."
              : mode === "edit"
                ? "Update Post"
                : "Add Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ========================= FORM FIELD ========================= */

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
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
  required = false,
  error,
  onChange,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <FormLabel required={required}>
        {label}
      </FormLabel>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        min={min}
        step={step}
        disabled={disabled}
        onChange={onChange}
        className={`mt-1.5 h-9 w-full rounded-lg border bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
        } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
      />

      {error && (
        <p className="mt-1 text-[9px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* ========================= SELECT FIELD ========================= */

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
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
  required = false,
  error,
  children,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="min-w-0">
      <FormLabel required={required}>
        {label}
      </FormLabel>

      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`mt-1.5 h-9 w-full rounded-lg border bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
        } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
      >
        {children}
      </select>

      {error && (
        <p className="mt-1 text-[9px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* ========================= FORM LABEL ========================= */

function FormLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[9px] font-medium text-slate-500">
      {children}

      {required && (
        <span className="ml-0.5 text-red-500">
          *
        </span>
      )}
    </label>
  );
}