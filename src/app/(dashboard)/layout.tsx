import { DashboardShell } from "@/components/shared/DashboardShell"
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
    <DashboardShell userName={user?.name} plan={plan}>
      {children}
    </DashboardShell>
  )
}
