"use client";

import { FileText, Home, LogOut, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Home, label: "Home", href: "/dashboard" },
  {
    icon: FileText,
    label: "Files & Docs",
    href: "/dashboard/document-file-manager",
  },
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SignOutButton>
              <SidebarMenuButton>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </SidebarMenuButton>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
