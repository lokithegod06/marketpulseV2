import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "@/lib/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number, showDecimals = true): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString("en-IN", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
  return `${amount < 0 ? "−" : ""}₹${formatted}`
}

export function formatSignedINR(amount: number, showDecimals = false): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString("en-IN", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
  return `${amount >= 0 ? "+" : "−"}₹${formatted}`
}

export const pnlColor = (val: number) =>
  val >= 0 ? "text-accent-green" : "text-accent-red"

export const pnlPrefix = (val: number) => (val >= 0 ? "+" : "")

export const PERSONAL_DATA_DATABASE_ERROR =
  "Personal data requires a working DATABASE_URL connection. Configure the database and retry."

export async function getSessionOrDemoUser() {
  const session = await auth()
  const user = session?.user as
    | { id?: string; name?: string | null; email?: string | null; plan?: string }
    | undefined

  if (!user?.id || !user.email) {
    throw new Error("UNAUTHORIZED")
  }

  return {
    id: user.id,
    name: user.name || "Trader",
    email: user.email,
    plan: user.plan === "PRO" ? "PRO" as const : "FREE" as const,
  }
}

export async function requirePro() {
  const user = await getSessionOrDemoUser()
  if (user.plan !== "PRO") throw new Error("UPGRADE_REQUIRED")
  return user
}
