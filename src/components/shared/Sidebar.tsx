"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Terminal,
  BookOpen,
  Activity,
  PieChart,
  Filter,
  List,
  Trophy,
  GraduationCap,
  Bot,
  UsersRound,
  Settings,
  X,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Terminal, badge: "F1", badgeType: "default" },
  { href: "/journal", label: "Trade Journal", icon: BookOpen, badge: "F2", badgeType: "default" },
  { href: "/discipline", label: "Discipline", icon: Activity, badge: "", badgeType: "green" },
  { href: "/portfolio", label: "Portfolio", icon: PieChart, badge: "PRO", badgeType: "pro" },
  { href: "/screeners", label: "Screeners", icon: Filter, badge: "F5", badgeType: "default" },
  { href: "/watchlist", label: "Watchlist", icon: List, badge: "20", badgeType: "default" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, badge: "#14", badgeType: "blue" },
  { href: "/courses", label: "Courses", icon: GraduationCap, badge: "PRO", badgeType: "pro" },
  { href: "/algo-bots", label: "Algo Bots", icon: Bot, badge: "", badgeType: "default" },
  { href: "/experts", label: "Experts", icon: UsersRound, badge: "PRO", badgeType: "pro" },
  { href: "/settings", label: "Settings", icon: Settings, badge: "", badgeType: "default" },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open, onClose])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        id="dashboard-navigation"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(84vw,280px)] flex-col select-none border-r border-border bg-[#080b13]/[0.98] backdrop-blur-md transition-transform duration-200 lg:static lg:z-auto lg:h-dvh lg:w-[220px] lg:min-w-[220px] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <svg width="28" height="20" viewBox="0 0 100 40" fill="none" aria-hidden="true">
              <path
                d="M4 20H24L38 6L52 34L66 14H78"
                stroke="#7dd3fc"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="56" cy="11" r="5.5" fill="#34d399" />
            </svg>
            <span className="text-[13px] font-semibold tracking-tight text-text-primary">
              Market Pulse
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-green shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="rounded-md p-1 text-text-secondary hover:bg-surface-low hover:text-text-primary lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-2 pt-5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
          Platform
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-11 items-center justify-between rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  active
                    ? "bg-surface-mid font-medium text-accent-blue"
                    : "text-text-secondary hover:bg-surface-low hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${active ? "text-accent-blue" : "text-text-secondary"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[10px] ${
                      item.badgeType === "green"
                        ? "rounded bg-accent-green/10 px-1.5 py-0.5 text-accent-green"
                        : item.badgeType === "pro"
                        ? "rounded border border-accent-blue/20 bg-accent-blue/10 px-1.5 py-0.5 text-[9px] text-accent-blue"
                        : item.badgeType === "blue"
                        ? "text-accent-blue"
                        : "text-text-muted"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="m-2.5 flex shrink-0 items-center justify-between rounded-xl border border-border bg-surface-low/60 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            <span className="text-[11px] text-text-secondary">NSE Feed Active</span>
          </div>
          <span className="font-mono text-[11px] text-text-muted">12ms</span>
        </div>
      </aside>
    </>
  )
}
