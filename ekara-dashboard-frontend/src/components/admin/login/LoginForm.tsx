"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import useLogin from "@/src/hooks/admin/useLogin";
import {
  loginSchema,
  LoginFormValues,
} from "@/src/validations/admin/login.validation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearError();
    setValidationErrors({});

    const formData: LoginFormValues = {
      email,
      password,
      remember_me: rememberMe,
    };

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const errors: {
        email?: string;
        password?: string;
      } = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          if (!errors[field]) {
            errors[field] = issue.message;
          }
        }
      });

      setValidationErrors(errors);
      return;
    }

    await login(validation.data);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (validationErrors.email) {
      setValidationErrors((previous) => ({
        ...previous,
        email: undefined,
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (validationErrors.password) {
      setValidationErrors((previous) => ({
        ...previous,
        password: undefined,
      }));
    }

    if (error) {
      clearError();
    }
  };

  return (
    <div className="relative z-10 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:rounded-3xl lg:flex-row">
        {/* Left Side - Branding */}
        <div className="relative flex min-h-[240px] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-8 text-slate-900 sm:min-h-[270px] sm:px-10 sm:py-10 md:min-h-[300px] lg:min-h-[560px] lg:w-[43%] lg:px-10 lg:py-12">
          {/* Dark blue ambient glow - top left */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-[260px] w-[260px] rounded-full bg-blue-700/18 blur-[80px] sm:-left-24 sm:-top-24 sm:h-[300px] sm:w-[300px] sm:bg-blue-700/20 lg:-left-32 lg:-top-32 lg:h-[420px] lg:w-[420px] lg:bg-blue-700/30 lg:blur-[110px]" />

          {/* Dark blue ambient glow - bottom right */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-[280px] w-[280px] rounded-full bg-blue-600/16 blur-[85px] sm:-bottom-24 sm:-right-24 sm:h-[320px] sm:w-[320px] sm:bg-blue-600/18 lg:-bottom-36 lg:-right-32 lg:h-[460px] lg:w-[460px] lg:bg-blue-600/25 lg:blur-[120px]" />

          {/* Center soft blue glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/7 blur-[70px] sm:h-[220px] sm:w-[220px] sm:bg-blue-500/9 lg:h-[300px] lg:w-[300px] lg:bg-blue-500/15 lg:blur-[100px]" />

          {/* Branding Content */}
          <div className="relative z-10 flex max-w-md flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Ekara
            </h1>
            <p className="mt-2 max-w-[260px] text-sm leading-5 text-slate-500 sm:mt-3 sm:text-sm lg:text-sm">
              Your modern dashboard experience starts here.
            </p>
            <div className="mt-5 h-1 w-12 rounded-full bg-blue-600/50 shadow-[0_0_18px_rgba(37,99,235,0.35)] sm:mt-7 sm:w-14 lg:mt-8 lg:w-16" />
          </div>
        </div>

        {/* Right Side - Login */}
        <div className="relative flex w-full flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:w-[57%] lg:px-12 lg:py-14">
          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative w-full max-w-[410px]">
            {/* Heading */}
            <div className="mb-7 text-center sm:mb-8 lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to your Ekara dashboard to continue
              </p>
            </div>

            {/* Backend Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="group relative">
                  <Mail
                    size={19}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                      validationErrors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold text-blue-900 transition-colors hover:text-blue-950"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={19}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                      validationErrors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.8} />
                    ) : (
                      <Eye size={18} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Remember */}
              <div className="flex items-center pt-0.5">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-900 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(30,58,138,0.25)] transition-all duration-200 hover:bg-blue-950 hover:shadow-[0_14px_30px_rgba(30,58,138,0.30)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {/* Button shine */}
                <span className="absolute inset-y-0 -left-20 w-16 -skew-x-12 bg-white/15 transition-all duration-700 group-hover:left-[115%]" />

                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-7 border-t border-slate-100 pt-5 text-center lg:mt-8 lg:text-left">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Ekara. All rights reserved.
              </p>
            </div>

            {/* Security */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 lg:justify-start">
              <LockKeyhole size={13} />
              <span>Your connection is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}