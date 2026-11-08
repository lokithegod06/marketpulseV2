import { Sidebar } from "@/components/shared/Sidebar"
import { Topbar } from "@/components/shared/Topbar"
import { TickerStrip } from "@/components/shared/TickerStrip"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
  const plan = (user as { plan?: string } | undefined)?.plan

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-base">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar
          userName={user?.name}
          plan={plan}
        />
        <TickerStrip />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface-base">
          {children}
        </main>
      </div>
    </div>
  )
}
