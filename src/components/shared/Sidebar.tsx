"use client"

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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] min-w-[220px] h-screen bg-[#080b13]/95 backdrop-blur-md border-r border-border flex flex-col z-40 select-none">
      {/* Brand Header */}
      <div className="h-[56px] px-5 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="20" viewBox="0 0 100 40" fill="none">
            <path
              d="M4 20H24L38 6L52 34L66 14H78"
              stroke="#7dd3fc"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="56" cy="11" r="5.5" fill="#34d399" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-text-primary tracking-tight">
              MarketPulse
            </span>
            <span className="text-[10px] text-text-secondary">Terminal v4.2</span>
          </div>
        </Link>
        <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_0_3px_rgba(52,211,153,0.2)] animate-pulse" />
      </div>

      <div className="px-5 pt-5 pb-2 text-[10px] font-medium tracking-wider text-text-muted uppercase">
        Platform
      </div>

      <nav className="px-2.5 flex-1 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? "bg-surface-mid text-accent-blue font-medium"
                  : "text-text-secondary hover:bg-surface-low hover:text-text-primary"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? "text-accent-blue" : "text-text-secondary"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono ${
                    item.badgeType === "green"
                      ? "text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded"
                      : item.badgeType === "pro"
                      ? "text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-1.5 py-0.5 rounded text-[9px]"
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

      {/* Bottom Feed Status */}
      <div className="m-2.5 px-3 py-2.5 bg-surface-low/60 border border-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <span className="text-[11px] text-text-secondary">NSE Feed Active</span>
        </div>
        <span className="text-[11px] font-mono text-text-muted">12ms</span>
      </div>
    </aside>
  )
}
