"use client";

import {
  AlertCircle,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type {
  Payment,
  PaymentStatus,
} from "@/src/types/admin/payment.types";

interface PaymentActionMenuProps {
  payment: Payment;

  onView?: (payment: Payment) => void;

  onEdit?: (payment: Payment) => void;

  onStatusChange?: (
    payment: Payment,
    status: PaymentStatus
  ) => void | Promise<void>;

  onReminderToggle?: (
    payment: Payment
  ) => void | Promise<void>;

  onDelete?: (
    payment: Payment
  ) => void | Promise<void>;

  reminderActionLabel?: string;

  onClose: () => void;

  anchorElement?: HTMLButtonElement | null;
}

export default function PaymentActionMenu({
  payment,
  onView,
  onEdit,
  onStatusChange,
  onReminderToggle,
  onDelete,
  reminderActionLabel,
  onClose,
  anchorElement,
}: PaymentActionMenuProps) {
  const [mounted, setMounted] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    visible: false,
  });

  /* =========================================================
     MOUNT
  ========================================================= */

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  /* =========================================================
     MENU POSITION
  ========================================================= */

  useLayoutEffect(() => {
    if (!anchorElement) {
      return;
    }

    const updatePosition = () => {
      const buttonRect =
        anchorElement.getBoundingClientRect();

      /* -------------------------------------------------------
         Hide menu if anchor is outside viewport
      ------------------------------------------------------- */

      const isOutsideViewport =
        buttonRect.bottom < 0 ||
        buttonRect.top > window.innerHeight ||
        buttonRect.right < 0 ||
        buttonRect.left > window.innerWidth;

      if (isOutsideViewport) {
        setPosition((previous) => ({
          ...previous,
          visible: false,
        }));

        return;
      }

      /* -------------------------------------------------------
         Menu dimensions
      ------------------------------------------------------- */

      const menuWidth = 210;

      /*
       * Increased height because we now have:
       * View
       * Edit
       * Status options
       * Reminder
       * Delete
       */
      const menuHeight = 360;

      const spacing = 8;

      /* -------------------------------------------------------
         Default: open below button
      ------------------------------------------------------- */

      let top =
        buttonRect.bottom + spacing;

      /* -------------------------------------------------------
         Open above if insufficient space below
      ------------------------------------------------------- */

      if (
        top + menuHeight >
        window.innerHeight - spacing
      ) {
        top =
          buttonRect.top -
          menuHeight -
          spacing;
      }

      /* -------------------------------------------------------
         Align right edge with button
      ------------------------------------------------------- */

      let left =
        buttonRect.right - menuWidth;

      /* -------------------------------------------------------
         Prevent left overflow
      ------------------------------------------------------- */

      if (left < spacing) {
        left = spacing;
      }

      /* -------------------------------------------------------
         Prevent right overflow
      ------------------------------------------------------- */

      if (
        left + menuWidth >
        window.innerWidth - spacing
      ) {
        left =
          window.innerWidth -
          menuWidth -
          spacing;
      }

      /* -------------------------------------------------------
         Prevent top overflow
      ------------------------------------------------------- */

      if (top < spacing) {
        top = spacing;
      }

      setPosition({
        top,
        left,
        visible: true,
      });
    };

    /* Initial calculation */
    updatePosition();

    /* Recalculate on scroll */
    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    /* Recalculate on resize */
    window.addEventListener(
      "resize",
      updatePosition
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

      window.removeEventListener(
        "resize",
        updatePosition
      );
    };
  }, [anchorElement]);

  /* =========================================================
     ACTION HANDLER
  ========================================================= */

  const handleAction = (
    callback?:
      | ((payment: Payment) => void)
      | ((payment: Payment) => Promise<void>)
  ) => {
    onClose();

    callback?.(payment);
  };

  /* =========================================================
     STATUS HANDLER
  ========================================================= */

  const handleStatusChange = (
    status: PaymentStatus
  ) => {
    onClose();

    onStatusChange?.(
      payment,
      status
    );
  };

  /* =========================================================
     REMINDER HANDLER
  ========================================================= */

  const handleReminderToggle = () => {
    onClose();

    onReminderToggle?.(payment);
  };

  /* =========================================================
     RENDER GUARD
  ========================================================= */

  if (
    !mounted ||
    !anchorElement ||
    !position.visible
  ) {
    return null;
  }

  /* =========================================================
     CURRENT STATUS
  ========================================================= */

  const currentStatus =
    payment.status;

  /* =========================================================
     MENU
  ========================================================= */

  const menu = (
    <div
      className="
        fixed
        z-[99999]
        w-[210px]
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        p-1.5
        shadow-[0_15px_40px_rgba(15,23,42,0.12)]
      "
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      {/* =====================================================
          VIEW PAYMENT
      ===================================================== */}

      {onView && (
        <button
          type="button"
          onClick={() =>
            handleAction(onView)
          }
          className="
            flex
            w-full
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-50
            hover:text-slate-900
          "
        >
          <Eye
            size={16}
            strokeWidth={1.8}
          />

          <span>
            View payment
          </span>
        </button>
      )}

      {/* =====================================================
          EDIT PAYMENT
      ===================================================== */}

      {onEdit && (
        <button
          type="button"
          onClick={() =>
            handleAction(onEdit)
          }
          className="
            flex
            w-full
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-50
            hover:text-slate-900
          "
        >
          <Pencil
            size={16}
            strokeWidth={1.8}
          />

          <span>
            Edit payment
          </span>
        </button>
      )}

      {/* =====================================================
          STATUS SECTION
      ===================================================== */}

      {onStatusChange && (
        <>
          <div className="my-1.5 border-t border-slate-100" />

          <div className="px-3 py-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Update Status
            </p>
          </div>

          {/* -------------------------------------------------
              DUE
          ------------------------------------------------- */}

          <button
            type="button"
            disabled={currentStatus === "due"}
            onClick={() =>
              handleStatusChange("due")
            }
            className={`
              flex
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              transition
              ${
                currentStatus === "due"
                  ? "cursor-default bg-amber-50 text-amber-600"
                  : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
              }
            `}
          >
            <Clock
              size={16}
              strokeWidth={1.8}
            />

            <span className="flex-1">
              Mark as Due
            </span>

            {currentStatus === "due" && (
              <span className="text-[10px] font-semibold">
                Current
              </span>
            )}
          </button>

          {/* -------------------------------------------------
              PAID
          ------------------------------------------------- */}

          <button
            type="button"
            disabled={currentStatus === "paid"}
            onClick={() =>
              handleStatusChange("paid")
            }
            className={`
              flex
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              transition
              ${
                currentStatus === "paid"
                  ? "cursor-default bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
              }
            `}
          >
            <CheckCircle2
              size={16}
              strokeWidth={1.8}
            />

            <span className="flex-1">
              Mark as Paid
            </span>

            {currentStatus === "paid" && (
              <span className="text-[10px] font-semibold">
                Current
              </span>
            )}
          </button>

          {/* -------------------------------------------------
              OVERDUE
          ------------------------------------------------- */}

          <button
            type="button"
            disabled={
              currentStatus === "overdue"
            }
            onClick={() =>
              handleStatusChange("overdue")
            }
            className={`
              flex
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              transition
              ${
                currentStatus === "overdue"
                  ? "cursor-default bg-red-50 text-red-600"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              }
            `}
          >
            <AlertCircle
              size={16}
              strokeWidth={1.8}
            />

            <span className="flex-1">
              Mark as Overdue
            </span>

            {currentStatus === "overdue" && (
              <span className="text-[10px] font-semibold">
                Current
              </span>
            )}
          </button>
        </>
      )}

      {/* =====================================================
          REMINDER
      ===================================================== */}

      {onReminderToggle && (
        <>
          <div className="my-1.5 border-t border-slate-100" />

          <button
            type="button"
            onClick={
              handleReminderToggle
            }
            className="
              flex
              w-full
              items-center
              gap-2.5
              rounded-lg
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              text-slate-600
              transition
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            {payment.enable_reminders ? (
              <BellOff
                size={16}
                strokeWidth={1.8}
              />
            ) : (
              <Bell
                size={16}
                strokeWidth={1.8}
              />
            )}

            <span>
              {reminderActionLabel ||
                (payment.enable_reminders
                  ? "Mute"
                  : "Remind")}
            </span>
          </button>
        </>
      )}

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      {(onView ||
        onEdit ||
        onStatusChange ||
        onReminderToggle) &&
        onDelete && (
          <div className="my-1.5 border-t border-slate-100" />
        )}

      {/* =====================================================
          DELETE PAYMENT
      ===================================================== */}

      {onDelete && (
        <button
          type="button"
          onClick={() =>
            handleAction(onDelete)
          }
          className="
            flex
            w-full
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-red-500
            transition
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <Trash2
            size={16}
            strokeWidth={1.8}
          />

          <span>
            Delete payment
          </span>
        </button>
      )}
    </div>
  );

  /* =========================================================
     PORTAL
  ========================================================= */

  return createPortal(
    menu,
    document.body
  );
}