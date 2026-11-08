"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Bell, LogOut, Search } from "lucide-react"
import { useUiStore } from "@/store/uiStore"
import { formatSignedINR } from "@/lib/utils"

type TopbarProps = {
  userName?: string | null
  plan?: string
}

type NiftySnapshot = {
  price: number | null
  change: number | null
  source: string
}

export function Topbar({ userName, plan }: TopbarProps) {
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
    <header className="h-[56px] min-h-[56px] bg-[#080b13]/85 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-low/80 border border-border rounded-lg text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <span className="text-text-primary font-medium">NSE/BSE</span>
          <span className="text-text-muted font-mono">{clock}</span>
        </div>

        {nifty && (
          <div
            title={`Nifty 50 spot · ${nifty.source}`}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-surface-low/80 border border-border rounded-lg text-[11px]"
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

        <div className="relative hidden md:flex items-center">
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

      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-text-muted tracking-wider font-medium uppercase">
            PORTFOLIO DAY P&L
          </span>
          <span
            title={pnlError ? "Unable to fetch live portfolio quotes" : "Based on portfolio holdings' daily market-price changes"}
            className={`text-[13px] font-mono font-semibold ${
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

        <div className="h-6 w-px bg-border" />

        <button
          type="button"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface-low hover:text-text-primary transition-colors"
          title="Real-time alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ff697b]" />
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-3.5 border-l border-border hover:opacity-90"
        >
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-text-primary">{displayName}</span>
            <span className="text-[10px] text-accent-blue font-medium">
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
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:border-accent-red/50 hover:text-accent-red"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
