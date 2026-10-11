"use client";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { AdminGuard } from "./AdminGuard";
import { adminNav } from "@/lib/adminNav";

/** Chrome shared by every back-office screen: guard, sidebar, navbar, header. */
export function AdminPage({
  section,
  titre,
  description,
  children,
}: {
  /** Sidebar entry to highlight, as adminNav labels it. */
  section: string;
  titre: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[var(--sane-background)]">
        <DashboardSidebar items={adminNav(section, 0)} />
        <div className="min-w-0 flex-1">
          <DashboardNavbar />
          <main className="p-5 sm:p-8">
            <h1 className="mb-1 text-[18px] font-bold text-[var(--sane-green-deep)]">{titre}</h1>
            {description && (
              <p className="mb-5 text-[12px] text-[var(--sane-text-light)]">{description}</p>
            )}
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
