"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { ScreenerCard } from "@/components/screeners/ScreenerCard"
import { ScreenerResults } from "@/components/screeners/ScreenerResults"
import { ChartinkResult } from "@/types"

type ScreenerDefinition = {
  id: string
  title: string
  description: string
  countLabel: string
  isPro: boolean
}

export default function ScreenersPage() {
  const [screeners, setScreeners] = useState<ScreenerDefinition[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [results, setResults] = useState<ChartinkResult[]>([])
  const [resultsSource, setResultsSource] = useState("")
  const [activeTitle, setActiveTitle] = useState("")
  const [error, setError] = useState("")
  const [loadingId, setLoadingId] = useState("")

  useEffect(() => {
    fetch("/api/screeners")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load screeners.")
        setScreeners(data.screeners)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  const handleRun = async (id: string, title: string) => {
    setSelectedId(id)
    setActiveTitle(title)
    setError("")
    setResults([])
    setLoadingId(id)
    try {
      const res = await fetch("/api/screeners/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenerId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Screener execution failed.")
      setResults(data.results)
      setResultsSource(data.source || "Source unavailable")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screener execution failed.")
    } finally {
      setLoadingId("")
    }
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Screeners"
        subtitle="App-managed scans · Free screeners and Pro-only ChartInk scans"
      />
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
        {error && (
          <div
            role="status"
            className={`mb-4 rounded-lg border p-3 text-xs ${
              error.includes("sample")
                ? "border-border bg-surface-low text-text-muted"
                : "border-accent-red/30 bg-accent-red/10 text-accent-red"
            }`}
          >
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {screeners.map((screener) => (
            <ScreenerCard
              key={screener.id}
              title={screener.title}
              description={screener.description}
              countLabel={screener.countLabel}
              isPro={screener.isPro}
              active={selectedId === screener.id}
              onRun={() => handleRun(screener.id, screener.title)}
            />
          ))}
        </div>
        {loadingId && (
          <p className="mt-5 text-xs text-text-secondary">Running screener…</p>
        )}
        {results.length > 0 && (
          <ScreenerResults title={activeTitle} results={results} source={resultsSource} />
        )}
      </div>
    </div>
  )
}
