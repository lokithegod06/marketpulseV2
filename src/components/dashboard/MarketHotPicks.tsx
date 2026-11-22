"use client"

import { useEffect, useState } from "react"
import { MarketHotPicksDigest } from "@/types"

type PicksResponse = {
  morning: MarketHotPicksDigest | null
  evening: MarketHotPicksDigest | null
}

export function MarketHotPicks() {
  const [picks, setPicks] = useState<PicksResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/dashboard/market-picks", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to load daily market picks.")
        setPicks(data)
      })
      .catch((cause: Error) => setError(cause.message))
  }, [])

  return (
    <section className="rounded-xl border border-border bg-surface-low p-5">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-text-primary">Daily AI Market-Mover Brief</h2>
        <p className="mt-1 text-[11px] text-text-muted">
          Source-linked headlines, refreshed around 9:00 AM and 6:00 PM IST. Not trading advice.
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
          {error}
        </p>
      )}
      {!error && !picks && (
        <p className="text-xs text-text-muted">Loading today&apos;s morning and evening briefs…</p>
      )}
      {picks && (
        <div className="grid gap-5 lg:grid-cols-2">
          <DigestColumn title="Morning hot picks" digest={picks.morning} session="MORNING" />
          <DigestColumn title="Evening hot picks" digest={picks.evening} session="EVENING" />
        </div>
      )}
    </section>
  )
}

function DigestColumn({
  title,
  digest,
  session,
}: {
  title: string
  digest: MarketHotPicksDigest | null
  session: "MORNING" | "EVENING"
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-accent-blue">{title}</h3>
        {digest && (
          <time className="text-[10px] text-text-muted" dateTime={digest.generatedAt}>
            {new Date(digest.generatedAt).toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
            })} IST
          </time>
        )}
      </div>
      {!digest && (
        <p className="rounded-lg border border-border/60 bg-surface-base p-3 text-[11px] text-text-muted">
          {session === "MORNING" ? "Morning picks are generated around 9:00 AM." : "Evening picks are generated around 6:00 PM."}
        </p>
      )}
      {digest && digest.items.length === 0 && (
        <p className="rounded-lg border border-border/60 bg-surface-base p-3 text-[11px] text-text-muted">
          No verified market-moving headlines were selected for this session.
        </p>
      )}
      {digest?.items.map((item) => (
        <article key={item.headlineId} className="border-t border-border/50 py-3 first:border-t-0">
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-text-primary hover:text-accent-blue"
          >
            {item.title}
          </a>
          <div className="mt-1 text-[10px] text-accent-blue">{item.source}</div>
          <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">{item.whyItMatters}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
            Watch: {item.watchFor}
          </p>
        </article>
      ))}
    </div>
  )
}
