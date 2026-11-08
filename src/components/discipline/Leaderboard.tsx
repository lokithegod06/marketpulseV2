"use client"
import { useState } from "react"

const ROWS = [
  { rank: "🥇 #1", name: "Vikram Singhania", sub: "Nifty Scalper · MIS Mode", score: 96, adherence: "98.4%", pnl: "+₹4,82,400", streak: "18 Green Days", segment: "F&O Only", isYou: false },
  { rank: "#2", name: "Pooja Iyer", sub: "BankNifty Gamma Trader", score: 94, adherence: "97.2%", pnl: "+₹3,68,900", streak: "16 Green Days", segment: "F&O Only", isYou: false },
  { rank: "#3", name: "Devansh Joshi", sub: "Options Seller · Iron Condor", score: 91, adherence: "95.0%", pnl: "+₹3,15,000", streak: "12 Green Days", segment: "F&O Only", isYou: false },
  { rank: "#4", name: "Ananya Nair", sub: "FinNIFTY Expiry", score: 89, adherence: "93.1%", pnl: "+₹2,65,400", streak: "11 Green Days", segment: "F&O Only", isYou: false },
  { rank: "#5", name: "Arjun Mehta", sub: "Intraday Index", score: 88, adherence: "96.0%", pnl: "+₹2,14,560", streak: "14 Green Days", segment: "F&O Only", isYou: false },
  { rank: "#5", name: "Rohit Kulkarni", sub: "Equity Breakout · Cash", score: 85, adherence: "92.8%", pnl: "+₹1,95,000", streak: "9 Green Days", segment: "Equity", isYou: false },
]

export function LeaderboardTable() {
  const [tab, setTab] = useState("All India")
  const filtered = ROWS.filter((r) => (tab === "Equity" ? r.segment === "Equity" || r.isYou : true))

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold text-text-primary">Trader Discipline Leaderboard</h3>
          <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2 py-0.5 rounded-full">
            Sample data
          </span>
        </div>
        <div className="flex gap-1 bg-surface-base p-1 rounded-lg border border-border text-[11px]">
          {["All India", "F&O Only", "Equity", "Weekly"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`px-3 py-1 rounded ${tab === item ? "bg-surface-mid text-text-primary font-medium" : "text-text-secondary"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted mb-4">
        Example leaderboard profiles and performance; real trader rankings will be added when the platform launches.
      </p>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-3">Rank</th>
            <th className="py-2 px-3">Trader Profile</th>
            <th className="py-2 px-3">Discipline Score</th>
            <th className="py-2 px-3">Rule Adherence</th>
            <th className="py-2 px-3">30-Day Net P&L</th>
            <th className="py-2 px-3">Streak</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {filtered.map((r) => (
            <tr
              key={r.name}
              className={`border-b border-border/50 ${
                r.isYou ? "bg-accent-blue/[0.04] border-accent-blue/20" : "hover:bg-surface-high/40"
              }`}
            >
              <td className="py-3 px-3 font-mono text-text-secondary">{r.rank}</td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${r.isYou ? "text-accent-blue" : "text-text-primary"}`}>{r.name}</span>
                  {r.isYou && (
                    <span className="text-[9px] font-mono bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-1.5 py-0.5 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-text-muted">{r.sub}</div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-accent-green">{r.score}</span>
                  <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green" style={{ width: `${r.score}%` }} />
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 font-mono">{r.adherence}</td>
              <td className="py-3 px-3 font-mono text-accent-green">{r.pnl}</td>
              <td className="py-3 px-3">
                <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">
                  {r.streak}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center text-[11px] text-text-muted pt-3">
        Showing top {filtered.length} of 1,420 registered pro traders across India
      </div>
    </div>
  )
}
