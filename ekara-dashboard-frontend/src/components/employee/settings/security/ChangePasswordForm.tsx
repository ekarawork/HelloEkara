"use client";

import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
} from "lucide-react";

import useSettings from "@/src/hooks/employee/useSettings";

/* =========================================================
   TYPES
========================================================= */

interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ChangePasswordForm() {
  const { changePassword, isUpdating } = useSettings();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] =
    useState<ChangePasswordFormData>({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  /* =======================================================
     VISIBILITY STATE
  ======================================================= */

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     ERROR STATE
  ======================================================= */

  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});

  const [submitError, setSubmitError] = useState<string | null>(
    null
  );

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitError(null);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = (): boolean => {
    const nextErrors: Partial<
      Record<keyof ChangePasswordFormData, string>
    > = {};

    if (!formData.current_password.trim()) {
      nextErrors.current_password =
        "Current password is required.";
    }

    if (!formData.new_password) {
      nextErrors.new_password =
        "New password is required.";
    } else if (formData.new_password.length < 8) {
      nextErrors.new_password =
        "New password must be at least 8 characters.";
    } else if (formData.new_password.length > 255) {
      nextErrors.new_password =
        "New password must not exceed 255 characters.";
    }

    if (!formData.confirm_password) {
      nextErrors.confirm_password =
        "Please confirm your new password.";
    } else if (
      formData.new_password !== formData.confirm_password
    ) {
      nextErrors.confirm_password =
        "Passwords do not match.";
    }

    if (
      formData.current_password &&
      formData.new_password &&
      formData.current_password === formData.new_password
    ) {
      nextErrors.new_password =
        "New password must be different from your current password.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setErrors({});
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update employee password.";

      setSubmitError(message);
    }
  };

  /* =======================================================
     PASSWORD INPUT
  ======================================================= */

  const renderPasswordInput = (
    name: keyof ChangePasswordFormData,
    label: string,
    value: string,
    showPassword: boolean,
    setShowPassword: React.Dispatch<
      React.SetStateAction<boolean>
    >,
    placeholder: string
  ) => {
    return (
      <div>
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
          <span className="ml-1 text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={handleChange}
            disabled={isUpdating}
            placeholder={placeholder}
            autoComplete={
              name === "current_password"
                ? "current-password"
                : "new-password"
            }
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
              errors[name]
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            disabled={isUpdating}
            aria-label={
              showPassword
                ? `Hide ${label}`
                : `Show ${label}`
            }
            className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors[name] && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
            <KeyRound size={19} strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your employee account password regularly
              to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-6 py-6">
          {/* Current Password */}

          {renderPasswordInput(
            "current_password",
            "Current Password",
            formData.current_password,
            showCurrentPassword,
            setShowCurrentPassword,
            "Enter your current password"
          )}

          {/* New Password */}

          {renderPasswordInput(
            "new_password",
            "New Password",
            formData.new_password,
            showNewPassword,
            setShowNewPassword,
            "Enter your new password"
          )}

          {/* Confirm Password */}

          {renderPasswordInput(
            "confirm_password",
            "Confirm New Password",
            formData.confirm_password,
            showConfirmPassword,
            setShowConfirmPassword,
            "Confirm your new password"
          )}

          {/* =================================================
              PASSWORD REQUIREMENTS
          ================================================= */}

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
            <p className="text-sm font-medium text-gray-800">
              Password requirements
            </p>

            <div className="mt-3 space-y-2">
              <PasswordRequirement
                valid={formData.new_password.length >= 8}
                text="At least 8 characters"
              />

              <PasswordRequirement
                valid={/[A-Z]/.test(formData.new_password)}
                text="At least one uppercase letter"
              />

              <PasswordRequirement
                valid={/[a-z]/.test(formData.new_password)}
                text="At least one lowercase letter"
              />

              <PasswordRequirement
                valid={/\d/.test(formData.new_password)}
                text="At least one number"
              />
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

interface PasswordRequirementProps {
  valid: boolean;
  text: string;
}

function PasswordRequirement({
  valid,
  text,
}: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-green-100 text-green-600"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        <Check size={10} strokeWidth={2.5} />
      </span>

      <span
        className={`text-xs ${
          valid ? "text-green-700" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
}