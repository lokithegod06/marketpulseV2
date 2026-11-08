"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/PageHeader"
import { ScoreRing } from "@/components/discipline/ScoreRing"

type DisciplineData = {
  hasActivity: boolean
  tradeCount: number
  currentScore: number | null
  streak: number
  compliancePct: number | null
  rules: { id: string; label: string; description: string | null }[]
}

export default function DisciplinePage() {
  const [data, setData] = useState<DisciplineData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/discipline")
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || "Failed to load discipline data.")
        setData(body)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <div className="pb-10">
      <PageHeader
        title="Discipline & Trading History"
        subtitle="Your score and streak are based on your own logged trades"
      />
      <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6">
        {error && (
          <div role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {error}
          </div>
        )}
        {!error && !data && (
          <p className="rounded-xl border border-border bg-surface-low p-5 text-xs text-text-secondary">
            Loading your discipline data…
          </p>
        )}
        {data && !data.hasActivity && (
          <section className="rounded-xl border border-border bg-surface-low p-8 text-center">
            <h2 className="text-base font-semibold text-text-primary">Your trading streak starts with your first trade</h2>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-text-secondary">
              No discipline score or streak is shown yet because you have not logged any trades. Once you add trades in your journal, this page will show your personal activity and checklist adherence.
            </p>
            <Link
              href="/journal"
              className="mt-5 inline-flex rounded-lg bg-accent-blue px-4 py-2 text-xs font-semibold text-[#001e2f]"
            >
              Open Trade Journal
            </Link>
          </section>
        )}
        {data?.hasActivity && (
          <>
            <section className="grid gap-5 lg:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-low p-4 sm:gap-6 sm:p-5">
                <ScoreRing score={data.currentScore ?? 0} />
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">Current discipline score</h2>
                  <p className="mt-1 text-xs text-text-secondary">Based on your saved discipline evaluation.</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface-low p-5">
                <div className="text-xs text-text-muted">Current trading streak</div>
                <div className="mt-2 text-2xl font-semibold text-text-primary">{data.streak} sessions</div>
                <div className="mt-1 text-xs text-text-secondary">{data.tradeCount} logged trades</div>
              </div>
              <div className="rounded-xl border border-border bg-surface-low p-5">
                <div className="text-xs text-text-muted">Checklist adherence</div>
                <div className="mt-2 text-2xl font-semibold text-text-primary">
                  {data.compliancePct === null ? "—" : `${data.compliancePct}%`}
                </div>
                <div className="mt-1 text-xs text-text-secondary">Calculated from your trade checklists</div>
              </div>
            </section>
            <section className="rounded-xl border border-border bg-surface-low p-5">
              <h2 className="text-sm font-semibold text-text-primary">Your active discipline rules</h2>
              {data.rules.length === 0 ? (
                <p className="mt-3 text-xs text-text-muted">You have not added any personal discipline rules yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border/50">
                  {data.rules.map((rule) => (
                    <li key={rule.id} className="py-3">
                      <div className="text-xs font-medium text-text-primary">{rule.label}</div>
                      {rule.description && <p className="mt-1 text-[11px] text-text-secondary">{rule.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
