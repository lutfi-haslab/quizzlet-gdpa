"use client";

import { DashboardSidebar } from "@/components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      <DashboardSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 fixed w-full z-10">
          <SidebarTrigger />
          <h1 className="font-semibold">Dashboard</h1>
        </header>
        <main
          className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 mt-14 lg:mt-[60px] overflow-auto"
          style={{
            width: open === true
              ? "calc(100vw - var(--sidebar-width))"
              : "100vw",
          }}
        >
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
