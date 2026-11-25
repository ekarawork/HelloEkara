"use client";

import { useEffect, useRef, useState } from "react";
import {
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { SocialCalendarPost } from "@/src/types/admin/socialCalendar.types";

interface SocialCalendarActionMenuProps {
  post: SocialCalendarPost;

  onView: (post: SocialCalendarPost) => void;
  onEdit: (post: SocialCalendarPost) => void;
  onDelete: (post: SocialCalendarPost) => void;

  disabled?: boolean;
}

export default function SocialCalendarActionMenu({
  post,
  onView,
  onEdit,
  onDelete,
  disabled = false,
}: SocialCalendarActionMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /* ========================= Close On Outside Click ========================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /* ========================= Handlers ========================= */

  const handleView = () => {
    setIsOpen(false);
    onView(post);
  };

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(post);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(post);
  };

  return (
    <div
      ref={menuRef}
      className="relative inline-block text-left"
    >
      {/* ========================= Trigger ========================= */}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Social calendar post actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {/* ========================= Dropdown ========================= */}

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5"
        >
          {/* View */}

          <button
            type="button"
            role="menuitem"
            onClick={handleView}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <Eye className="h-4 w-4 text-gray-500" />

            <span>View</span>
          </button>

          {/* Edit */}

          <button
            type="button"
            role="menuitem"
            onClick={handleEdit}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <Pencil className="h-4 w-4 text-gray-500" />

            <span>Edit</span>
          </button>

          {/* Divider */}

          <div className="my-1 border-t border-gray-100" />

          {/* Delete */}

          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />

            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}