"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  IconCalendarEvent,
  IconChevronRight,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconPhoto,
  IconSparkles,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";

const NAV_ITEMS = [
  {
    label: "Rundown",
    href: "/admin/rundown",
    icon: IconCalendarEvent,
    description: "Edit participant names",
  },
  {
    label: "Anggota",
    href: "/admin/members",
    icon: IconUsersGroup,
    description: "Manage church members",
  },
  {
    label: "Gambar",
    href: "/admin/images",
    icon: IconPhoto,
    description: "Hero & Sabbath images",
  },
];

type AdminShellProps = {
  children: React.ReactNode;
  user: User;
};

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/8 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 shadow-[0_4px_12px_rgba(1,75,63,0.4)]">
            <IconSparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">VNI Admin</p>
            <p className="text-[10px] text-white/40">Content Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-700/25 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]"
                  : "text-white/60 hover:bg-white/6 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                stroke={1.8}
                className={active ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"}
              />
              <div className="flex-1 min-w-0">
                <p className="leading-none">{item.label}</p>
                <p className="mt-0.5 truncate text-[10px] font-normal text-white/30">
                  {item.description}
                </p>
              </div>
              {active && <IconChevronRight size={14} className="text-emerald-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign out */}
      <div className="border-t border-white/8 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/30 text-xs font-bold text-emerald-400">
            {user.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Admin</p>
            <p className="truncate text-[10px] text-white/40">{user.email}</p>
          </div>
        </div>
        <button
          id="admin-signout"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/50 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <IconLogout size={15} stroke={1.8} />
          {signingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar — desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/8 bg-slate-900/60 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex h-full w-64 flex-col border-r border-white/8 bg-slate-900">
            <button
              className="absolute right-4 top-4 text-white/50 hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <IconX size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex items-center gap-4 border-b border-white/8 bg-slate-900/60 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white"
            aria-label="Open sidebar"
          >
            <IconMenu2 size={22} />
          </button>
          <div className="flex items-center gap-2">
            <IconLayoutDashboard size={18} className="text-emerald-400" />
            <span className="text-sm font-semibold text-white">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
