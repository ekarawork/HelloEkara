"use client";

import {
  Bell,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Client } from "@/src/types/admin/client.types";

interface ClientActionMenuProps {
  client: Client;
  onView?: (client: Client) => void;
  onViewPortal?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDisable?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onRemindPayment?: (client: Client) => void;
  onClose: () => void;
}

export default function ClientActionMenu({
  client,
  onView,
  onViewPortal,
  onEdit,
  onDisable,
  onDelete,
  onRemindPayment,
  onClose,
}: ClientActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [openUpward, setOpenUpward] = useState(false);

  const handleClick = (
    callback?: (client: Client) => void
  ) => {
    onClose();
    callback?.(client);
  };

  const isDisabled = client.status === "INACTIVE";

  useLayoutEffect(() => {
    const checkMenuPosition = () => {
      if (!menuRef.current) return;

      const rect =
        menuRef.current.getBoundingClientRect();

      const spaceBelow =
        window.innerHeight - rect.top;

      const spaceAbove = rect.top;

      const menuHeight = rect.height;

      // Open upward if there is not enough space below
      // and there is enough space above.
      if (
        spaceBelow < menuHeight + 16 &&
        spaceAbove > menuHeight + 16
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
      {/* View Client Portal */}
      <button
        type="button"
        onClick={() => handleClick(onViewPortal)}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Eye
          size={16}
          strokeWidth={1.8}
        />

        <span>View client portal</span>
      </button>

      {/* View Client Details */}
      <button
        type="button"
        onClick={() => handleClick(onView)}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Eye
          size={16}
          strokeWidth={1.8}
        />

        <span>View client details</span>
      </button>

      {/* Edit Client */}
      <button
        type="button"
        onClick={() => handleClick(onEdit)}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Pencil
          size={16}
          strokeWidth={1.8}
        />

        <span>Edit client</span>
      </button>

      {/* Disable / Enable Client */}
      <button
        type="button"
        onClick={() => handleClick(onDisable)}
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
            ? "Enable client"
            : "Disable client"}
        </span>
      </button>

      {/* Remind Payment */}
      <button
        type="button"
        onClick={() =>
          handleClick(onRemindPayment)
        }
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Bell
          size={16}
          strokeWidth={1.8}
        />

        <span>Remind payment</span>
      </button>

      {/* Divider */}
      <div className="my-1 border-t border-slate-100" />

      {/* Delete Client */}
      <button
        type="button"
        onClick={() => handleClick(onDelete)}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2
          size={16}
          strokeWidth={1.8}
        />

        <span>Delete client</span>
      </button>
    </div>
  );
}