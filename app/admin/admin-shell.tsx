"use client";

import type { User } from "@supabase/supabase-js";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconCalendarEvent,
  IconChevronRight,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconPhoto,
  IconUsersGroup,
} from "@tabler/icons-react";
import { MotionConfig } from "framer-motion";

import SideSheet from "@/components/ui/side-sheet";
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

  const sidebarContent = (
    <div className="flex min-h-full flex-col">
      {/* Logo */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">VNI Admin</p>
            <p className="text-sm text-muted-foreground">Content Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-card text-secondary"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon
                className={
                  active
                    ? "text-success"
                    : "text-muted-foreground group-hover:text-muted-foreground"
                }
                size={18}
                stroke={1.8}
              />
              <div className="flex-1 min-w-0">
                <p className="leading-snug">{item.label}</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {active && (
                <IconChevronRight className="text-success" size={14} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign out */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-sm font-bold text-success">
            {user.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              Admin
            </p>
            <p className="break-all text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <button
          className="ns-secondary w-full"
          disabled={signingOut}
          id="admin-signout"
          onClick={handleSignOut}
        >
          <IconLogout size={15} stroke={1.8} />
          {signingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="newskin flex min-h-screen">
        <a
          className="fixed left-5 top-2 z-[11000] -translate-y-24 rounded-xl bg-primary px-5 py-3 text-primary-foreground focus:translate-y-0"
          href="#admin-content"
        >
          Lewati ke konten
        </a>
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
          <div className="sticky top-0 h-dvh overflow-y-auto">
            {sidebarContent}
          </div>
        </aside>

        {/* Sidebar — mobile overlay */}
        <SideSheet
          open={sidebarOpen}
          side="left"
          title="Menu"
          width="sm:w-80"
          onClose={() => setSidebarOpen(false)}
        >
          {sidebarContent}
        </SideSheet>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile topbar */}
          <header className="flex items-center gap-4 border-b border-border bg-background px-4 py-3 lg:hidden">
            <button
              aria-expanded={sidebarOpen}
              aria-haspopup="dialog"
              aria-label="Open sidebar"
              className="ns-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu2 size={22} />
            </button>
            <div className="flex items-center gap-2">
              <IconLayoutDashboard className="text-success" size={18} />
              <span className="text-sm font-semibold text-foreground">
                Admin Panel
              </span>
            </div>
          </header>

          <main
            data-scroll-lock-target
            className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 outline-none md:p-8 lg:py-12"
            id="admin-content"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
