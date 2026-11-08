"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Bell, LogOut, Menu, Search } from "lucide-react"
import { useUiStore } from "@/store/uiStore"
import { formatSignedINR } from "@/lib/utils"

type TopbarProps = {
  userName?: string | null
  plan?: string
  onMenuClick: () => void
  isSidebarOpen: boolean
}

type NiftySnapshot = {
  price: number | null
  change: number | null
  source: string
}

export function Topbar({ userName, plan, onMenuClick, isSidebarOpen }: TopbarProps) {
  const { searchQuery, setSearchQuery, dayUnrealizedPnl } = useUiStore()
  const [clock, setClock] = useState("09:12 AM IST")
  const [pnlError, setPnlError] = useState(false)
  const [nifty, setNifty] = useState<NiftySnapshot>({
    price: null,
    change: null,
    source: "Loading",
  })
  const displayName = userName?.trim() || "Trader"
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase() + " IST"
      )
    }
    update()
    const id = setInterval(update, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let active = true
    const updateNifty = async () => {
      try {
        const res = await fetch("/api/dashboard/pre-market", { cache: "no-store" })
        if (!res.ok) throw new Error("Market data unavailable")
        const { data } = await res.json()
        if (!Number.isFinite(data?.giftNiftyPrice) || !Number.isFinite(data?.giftNiftyChange)) {
          throw new Error("Market data unavailable")
        }
        if (active) {
          setNifty({
            price: data.giftNiftyPrice,
            change: data.giftNiftyChange,
            source: data.sources?.nifty || "Sample",
          })
        }
      } catch {
        if (active) setNifty({ price: null, change: null, source: "Unavailable" })
      }
    }

    updateNifty()
    const id = setInterval(updateNifty, 60_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    let active = true
    const updatePnl = async () => {
      try {
        const res = await fetch("/api/dashboard/pnl", { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch P&L")
        if (active) {
          useUiStore.getState().setDayUnrealizedPnl(data.dayPnl)
          setPnlError(false)
        }
      } catch {
        if (active) {
          useUiStore.getState().setDayUnrealizedPnl(null)
          setPnlError(true)
        }
      }
    }

    updatePnl()
    const id = setInterval(updatePnl, 60_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <header className="z-30 flex h-14 min-h-14 items-center justify-between gap-2 border-b border-border bg-[#080b13]/85 px-3 backdrop-blur-md sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="dashboard-navigation"
          aria-expanded={isSidebarOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-low/80 text-text-secondary hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface-low/80 px-2 py-1 text-[10px] sm:px-3 sm:text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <span className="font-medium text-text-primary">NSE/BSE</span>
          <span className="font-mono text-text-muted">{clock}</span>
        </div>

        {nifty && (
          <div
            title={`Nifty 50 spot · ${nifty.source}`}
            className="hidden min-w-0 items-center gap-2 rounded-lg border border-border bg-surface-low/80 px-3 py-1 text-[11px] md:inline-flex"
          >
            <span className="text-text-secondary font-medium">NIFTY 50</span>
            <span className="text-text-primary font-mono font-semibold">
              {nifty.price === null ? "—" : nifty.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span className={`font-mono text-[10px] ${nifty.change === null ? "text-text-muted" : nifty.change >= 0 ? "text-accent-green" : "text-accent-red"}`}>
              {nifty.change === null ? "—" : `${nifty.change > 0 ? "+" : ""}${nifty.change.toFixed(2)}%`}
            </span>
            <span className="text-[9px] text-text-muted">{nifty.source}</span>
          </div>
        )}

        <div className="relative hidden items-center lg:flex">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instruments, news…"
            className="bg-surface-low/60 border border-border rounded-lg pl-8 pr-9 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue w-[240px]"
          />
          <span className="absolute right-2 text-[10px] text-text-muted bg-surface-mid px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
        <span
          title={pnlError ? "Unable to fetch live portfolio quotes" : "Portfolio day P&L from holdings"}
          className={`font-mono text-[11px] font-semibold sm:hidden ${
            dayUnrealizedPnl === null
              ? "text-text-muted"
              : dayUnrealizedPnl >= 0
                ? "text-accent-green"
                : "text-accent-red"
          }`}
        >
          {dayUnrealizedPnl === null ? "P&L —" : formatSignedINR(dayUnrealizedPnl)}
        </span>
        <div className="hidden flex-col text-right sm:flex">
          <span className="text-[9px] font-medium uppercase tracking-wider text-text-muted sm:text-[10px]">
            PORTFOLIO DAY P&L
          </span>
          <span
            title={pnlError ? "Unable to fetch live portfolio quotes" : "Based on portfolio holdings' daily market-price changes"}
            className={`text-xs font-mono font-semibold sm:text-[13px] ${
              dayUnrealizedPnl === null
                ? "text-text-muted"
                : dayUnrealizedPnl >= 0
                  ? "text-accent-green"
                  : "text-accent-red"
            }`}
          >
            {dayUnrealizedPnl === null ? "—" : formatSignedINR(dayUnrealizedPnl)}
          </span>
        </div>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <button
          type="button"
          className="relative hidden h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-low hover:text-text-primary md:flex"
          title="Real-time alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff697b]" />
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-2 border-l border-border pl-2 hover:opacity-90 sm:gap-2.5 sm:pl-3.5"
        >
          <div className="flex flex-col text-right">
            <span className="hidden max-w-28 truncate text-xs font-semibold text-text-primary sm:block">{displayName}</span>
            <span className="hidden text-[10px] font-medium text-accent-blue sm:block">
              {plan === "PRO" ? "Pro Trader" : plan === "FREE" ? "Free Trader" : "Trader"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0d2137] border-2 border-border flex items-center justify-center text-xs font-semibold text-accent-blue">
            {initials}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs text-text-secondary hover:border-accent-red/50 hover:text-accent-red sm:h-auto sm:w-auto sm:gap-1.5 sm:px-2.5 sm:py-1.5"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
