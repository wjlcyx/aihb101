"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ChatContextProvider } from "@/contexts/chat"
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ChatContextProvider> 
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ChatContextProvider>
  )
}
