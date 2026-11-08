"use client"

import { useCallback, useState } from "react"
import { Sidebar } from "@/components/shared/Sidebar"
import { Topbar } from "@/components/shared/Topbar"
import { TickerStrip } from "@/components/shared/TickerStrip"

export function DashboardShell({
  children,
  userName,
  plan,
}: {
  children: React.ReactNode
  userName?: string | null
  plan?: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const openSidebar = useCallback(() => setSidebarOpen(true), [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface-base">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          userName={userName}
          plan={plan}
          onMenuClick={openSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <TickerStrip />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-base">
          {children}
        </main>
      </div>
    </div>
  )
}
