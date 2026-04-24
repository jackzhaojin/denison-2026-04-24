import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-white/20 bg-[color:var(--color-denison-red-dark)] px-4">
          <SidebarTrigger className="text-white" />
          <span className="font-eyebrow text-[10px] text-gold">
            Denison University · CS 271 · Live Demo
          </span>
        </header>
        <main className="min-h-[calc(100svh-3rem)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
