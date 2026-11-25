"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ClientPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function ClientPerformanceModal({
  isOpen,
  onClose,
  children,
  title = "Client Performance",
  description = "View and manage the client's performance data and service metrics.",
}: ClientPerformanceModalProps) {
  /* ESCAPE + BODY SCROLL LOCK */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent background page scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  /* CLOSED */
  if (!isOpen) {
    return null;
  }

  /* RENDER */
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 px-3 py-4 backdrop-blur-[2px] sm:px-5 sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* MODAL */}
      <div
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.20)] sm:max-h-[calc(100vh-3rem)] sm:rounded-2xl"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-4.5">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              {title}
            </h2>

            <p className="mt-0.5 text-[11px] leading-4 text-slate-400 sm:text-xs">
              {description}
            </p>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}