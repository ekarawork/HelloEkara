"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Lock,
} from "lucide-react";
import {
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { ClientPerformance } from "@/src/types/admin/clientPerformance.types";

interface ClientPerformanceActionMenuProps {
  performance: ClientPerformance;
  onView?: (performance: ClientPerformance) => void;
  onEdit?: (performance: ClientPerformance) => void;
  onDelete?: (performance: ClientPerformance) => void;
  onClose: () => void;
  anchorElement?: HTMLButtonElement | null;
}

export default function ClientPerformanceActionMenu({
  performance,
  onView,
  onEdit,
  onDelete,
  onClose,
  anchorElement,
}: ClientPerformanceActionMenuProps) {
  const [mounted, setMounted] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    visible: false,
  });

  const isLocked = performance.edit_count >= 2;

  /*
   * Portal is only available on client.
   */
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Calculate menu position.
   */
  useLayoutEffect(() => {
    if (!anchorElement) {
      return;
    }

    const updatePosition = () => {
      const buttonRect =
        anchorElement.getBoundingClientRect();

      /*
       * If button is completely outside
       * the viewport, hide the menu.
       */
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

      /*
       * Menu size.
       *
       * The menu is 200px wide.
       * Height is approximately 150px.
       */
      const menuWidth = 200;
      const menuHeight = 160;

      const spacing = 8;

      /*
       * Default: open below button.
       */
      let top = buttonRect.bottom + spacing;

      /*
       * If there isn't enough space below,
       * open upward.
       */
      if (
        top + menuHeight >
        window.innerHeight - spacing
      ) {
        top =
          buttonRect.top -
          menuHeight -
          spacing;
      }

      /*
       * Align right edge of menu
       * with right edge of button.
       */
      let left =
        buttonRect.right - menuWidth;

      /*
       * Prevent going outside left edge.
       */
      if (left < spacing) {
        left = spacing;
      }

      /*
       * Prevent going outside right edge.
       */
      if (
        left + menuWidth >
        window.innerWidth - spacing
      ) {
        left =
          window.innerWidth -
          menuWidth -
          spacing;
      }

      setPosition({
        top,
        left,
        visible: true,
      });
    };

    /*
     * Initial position.
     */
    updatePosition();

    /*
     * Recalculate whenever page/table
     * is scrolled.
     */
    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    /*
     * Recalculate when browser resizes.
     */
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

  const handleClick = (
    callback?: (performance: ClientPerformance) => void
  ) => {
    onClose();
    callback?.(performance);
  };

  if (
    !mounted ||
    !anchorElement ||
    !position.visible
  ) {
    return null;
  }

  const menu = (
    <div
      className="
        fixed
        z-[99999]
        w-[200px]
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
      {/* VIEW */}
      {onView && (
        <button
          type="button"
          onClick={() =>
            handleClick(onView)
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
            View performance
          </span>
        </button>
      )}

      {/* EDIT / LOCKED */}
      {isLocked ? (
        <button
          type="button"
          disabled
          className="
            flex
            w-full
            cursor-not-allowed
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-400
          "
        >
          <Lock
            size={16}
            strokeWidth={1.8}
          />

          <span>
            Client performance locked
          </span>
        </button>
      ) : (
        onEdit && (
          <button
            type="button"
            onClick={() =>
              handleClick(onEdit)
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
              Edit performance
            </span>
          </button>
        )
      )}

      {/* DIVIDER */}
      {(onView || onEdit) && onDelete && (
        <div className="my-1 border-t border-slate-100" />
      )}

      {/* DELETE */}
      {onDelete && (
        <button
          type="button"
          onClick={() =>
            handleClick(onDelete)
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
            Delete performance
          </span>
        </button>
      )}
    </div>
  );

  return createPortal(
    menu,
    document.body
  );
}