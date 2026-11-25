"use client";

import {
  BarChart3,
  CalendarDays,
  Download,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  WalletCards,
  FolderKanban,
  Settings,
  ClipboardList,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLogin from "@/src/hooks/admin/useLogin";
import { getUser } from "@/src/utils/storage";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/employee/dashboard",
  },
  {
    label: "My Tasks",
    icon: ClipboardList,
    href: "/employee/tasks",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/employee/settings",
  },
];

export default function EmployeeNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isLoading: isLoggingOut } = useLogin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Employee");

  /* GET LOGGED IN USER */
  useEffect(() => {
    const user = getUser();
    if (user) {
      const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ");
      if (fullName) {
        setUserName(fullName);
      }
    }
  }, []);

  /* CLOSE MOBILE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* PREVENT BODY SCROLL WHEN DRAWER OPEN */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /* NAVIGATION */
  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  /* LOGOUT */
  const handleLogout = async () => {
    await logout();
  };

  /* ACTIVE ITEM */
  const isItemActive = (href: string) => {
    return (
      pathname === href ||
      (href !== "/employee/dashboard" && pathname.startsWith(href))
    );
  };

  /* CURRENT PAGE TITLE */
  const currentPage =
    pathname === "/employee/dashboard"
      ? "Dashboard"
      : navItems.find((item) => isItemActive(item.href))?.label || "Dashboard";

  return (
    <>
      {/* DESKTOP / TABLET NAVBAR */}
      <header className="hidden w-full border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto max-w-[1600px] px-5 py-3 xl:px-7">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT - Welcome */}
            <div className="min-w-[120px] xl:min-w-[160px]">
              <p className="text-xs font-medium text-slate-400">
                Welcome back, {userName}
              </p>
              <h1 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 xl:text-xl">
                {currentPage}
              </h1>
            </div>

            {/* CENTER NAV */}
            <nav className="flex shrink-0 items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-0.5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.href);

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    title={item.label}
                    className={`group flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#2E3192] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    } xl:px-3`}
                  >
                    <Icon size={14} strokeWidth={1.8} />
                    <span className="hidden xl:inline">{item.label}</span>
                  </button>
                );
              })}

              {/* DIVIDER */}
              <div className="mx-0.5 h-5 w-px bg-slate-200" />

              {/* SIGN OUT */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Sign out"
                className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition-all duration-200 hover:bg-[#8D4004]/10 hover:text-[#8D4004] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                ) : (
                  <LogOut size={14} strokeWidth={1.8} />
                )}

                <span>
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </span>
              </button>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex min-w-[120px] items-center justify-end gap-1.5 xl:min-w-[160px]">

              {/* PROFILE */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVBAR */}
      <header className="relative z-40 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-3">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2.5">
            {/* MENU */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>

            {/* TITLE */}
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-slate-400">
                Welcome back, {userName}
              </p>
              <h1 className="truncate text-base font-bold tracking-tight text-slate-900">
                {currentPage}
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* EXPORT */}
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Download size={12} strokeWidth={1.8} />
            </button>

            {/* PROFILE */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* MOBILE DRAWER */}
          <aside
            className="absolute left-0 top-0 flex h-full w-[78%] max-w-[280px] flex-col bg-white shadow-[8px_0_20px_rgba(15,23,42,0.1)] animate-in slide-in-from-left duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white">
                  A
                </div>
                <div>
                  <h2 className="text-[13px] font-bold text-slate-900">
                    Agency Portal
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Employee Center
                  </p>
                </div>
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="mx-3.5 border-t border-slate-100" />

            {/* MENU */}
            <div className="flex-1 overflow-y-auto px-2.5 pt-10 pb-4">
              <p className="mb-2 px-2 text-[9px] uppercase tracking-[0.12em] text-slate-400">
                Workspace
              </p>
              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigation(item.href)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-all duration-200 ${isActive ? "bg-[#F0F0FF] font-semibold text-[#2E3192]" : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                      <Icon size={16} strokeWidth={1.7} className="shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 p-2.5">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                ) : (
                  <LogOut size={16} strokeWidth={1.7} />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}