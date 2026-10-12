"use client";

import { RoleGuard } from "@/components/dashboard/RoleGuard";

/**
 * Gates every page under /dashboard/admin.
 *
 * Guarding here rather than per page is the point: six admin screens shipped
 * without a guard because each one had to remember to add its own. A layout
 * cannot be forgotten by a new page.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={["administrateur", "organisateur"]} espace="le back-office">
      {children}
    </RoleGuard>
  );
}
