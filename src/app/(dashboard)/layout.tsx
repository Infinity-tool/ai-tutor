import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { Providers } from "@/shared/components/Providers";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Header } from "@/shared/components/layout/Header";
import { BottomNav } from "@/shared/components/layout/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] relative">
        {/* Cosmic background for dashboard */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none"
          style={{ background: "var(--gradient-cosmos)" }} />
        {/* Desktop sidebar — hidden on mobile */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />

          {/* Page content — extra bottom padding on mobile for bottom nav */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar pb-20 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </Providers>
  );
}
