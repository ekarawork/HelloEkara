"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Employee } from "@/src/types/admin/employee.types";

/* ========================= Props ========================= */

interface EmployeeActionMenuProps {
  employee: Employee;

  onView?: (
    employee: Employee
  ) => void;

  onEdit?: (
    employee: Employee
  ) => void;

  onDisable?: (
    employee: Employee
  ) => void;

  onDelete?: (
    employee: Employee
  ) => void;

  onClose: () => void;
}

/* ========================= Component ========================= */

export default function EmployeeActionMenu({
  employee,
  onView,
  onEdit,
  onDisable,
  onDelete,
  onClose,
}: EmployeeActionMenuProps) {
  const menuRef =
    useRef<HTMLDivElement>(null);

  const [openUpward, setOpenUpward] =
    useState(false);

  /* ========================= Handle Click ========================= */

  const handleClick = (
    callback?: (
      employee: Employee
    ) => void
  ) => {
    onClose();
    callback?.(employee);
  };

  /* ========================= Employee Status ========================= */

  const isDisabled =
    employee.status === "INACTIVE";

  /* ========================= Menu Position ========================= */

  useLayoutEffect(() => {
    const checkMenuPosition = () => {
      if (!menuRef.current) return;

      const rect =
        menuRef.current.getBoundingClientRect();

      const spaceBelow =
        window.innerHeight - rect.top;

      const spaceAbove =
        rect.top;

      const menuHeight =
        rect.height;

      // Open upward if there is not enough
      // space below and enough space above.
      if (
        spaceBelow <
          menuHeight + 16 &&
        spaceAbove >
          menuHeight + 16
      ) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    };

    checkMenuPosition();

    window.addEventListener(
      "resize",
      checkMenuPosition
    );

    window.addEventListener(
      "scroll",
      checkMenuPosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        checkMenuPosition
      );

      window.removeEventListener(
        "scroll",
        checkMenuPosition,
        true
      );
    };
  }, []);

  /* ========================= Render ========================= */

  return (
    <div
      ref={menuRef}
      className={`
        absolute
        right-0
        z-50
        w-[230px]
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        p-1.5
        shadow-[0_15px_40px_rgba(15,23,42,0.12)]
        ${
          openUpward
            ? "bottom-full mb-2"
            : "top-full mt-2"
        }
      `}
      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >
      {/* ========================= View Employee ========================= */}

      <button
        type="button"
        onClick={() =>
          handleClick(onView)
        }
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Eye
          size={16}
          strokeWidth={1.8}
        />

        <span>
          View employee
        </span>
      </button>

      {/* ========================= Edit Employee ========================= */}

      <button
        type="button"
        onClick={() =>
          handleClick(onEdit)
        }
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Pencil
          size={16}
          strokeWidth={1.8}
        />

        <span>
          Edit employee
        </span>
      </button>

      {/* ========================= Disable / Enable Employee ========================= */}

      <button
        type="button"
        onClick={() =>
          handleClick(onDisable)
        }
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
          isDisabled
            ? "text-green-600 hover:bg-green-50 hover:text-green-700"
            : "text-red-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <span
          className={`ml-[1px] h-1.5 w-1.5 rounded-full ${
            isDisabled
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />

        <span>
          {isDisabled
            ? "Enable employee"
            : "Disable employee"}
        </span>
      </button>

      {/* ========================= Divider ========================= */}

      <div className="my-1 border-t border-slate-100" />

      {/* ========================= Delete Employee ========================= */}

      <button
        type="button"
        onClick={() =>
          handleClick(onDelete)
        }
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2
          size={16}
          strokeWidth={1.8}
        />

        <span>
          Delete employee
        </span>
      </button>
    </div>
  );
}