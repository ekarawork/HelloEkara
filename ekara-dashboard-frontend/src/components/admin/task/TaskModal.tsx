"use client";

import {
  ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function TaskModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: TaskModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/40
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[85vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-xl
        "
      >
        {/* ========================= Header ========================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-100
            px-5
            py-4
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-base
                font-semibold
                text-slate-900
              "
            >
              {title}
            </h2>

            {description && (
              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-600
            "
            aria-label="Close modal"
          >
            <X
              size={17}
            />
          </button>
        </div>

        {/* ========================= Content ========================= */}

        <div
          className="
            min-h-0
            overflow-y-auto
            px-5
            py-5
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}