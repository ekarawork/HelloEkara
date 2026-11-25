"use client";

import type { ChangeEvent } from "react";
import { Search, X } from "lucide-react";

/* ========================= Types ========================= */

interface EmployeeTaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/* ========================= Component ========================= */

export default function EmployeeTaskSearch({
  value,
  onChange,
  placeholder = "Search tasks...",
  disabled = false,
  loading = false,
  className = "",
}: EmployeeTaskSearchProps) {
  const isDisabled = disabled || loading;

  /* ========================= Handlers ========================= */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  /* ========================= Render ========================= */

  return (
    <div
      className={`relative w-full ${className}`}
    >
      {/* ========================= Search Icon ========================= */}

      <Search
        size={18}
        className="
          pointer-events-none
          absolute
          left-3.5
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      {/* ========================= Search Input ========================= */}

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        autoComplete="off"
        aria-label="Search tasks"
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          py-2.5
          pl-10
          pr-10
          text-sm
          text-slate-700
          placeholder:text-slate-400
          outline-none
          transition
          focus:border-[#2E3192]
          focus:ring-2
          focus:ring-[#2E3192]/10
          disabled:cursor-not-allowed
          disabled:bg-slate-50
          disabled:text-slate-400
        "
      />

      {/* ========================= Loading Indicator ========================= */}

      {loading && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          <div
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-[#2E3192]
            "
            aria-label="Loading"
          />
        </div>
      )}

      {/* ========================= Clear Button ========================= */}

      {!loading && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          disabled={isDisabled}
          aria-label="Clear search"
          className="
            absolute
            right-2.5
            top-1/2
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition-all
            duration-200
            hover:bg-[#2E3192]/10
            hover:text-[#2E3192]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}