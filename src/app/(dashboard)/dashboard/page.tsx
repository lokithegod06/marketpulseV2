"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PreMarketCard } from "@/components/dashboard/PreMarketCard"
import { GlobalMarketsRow } from "@/components/dashboard/GlobalMarketsRow"
import { BiasCard } from "@/components/dashboard/BiasCard"
import { VixCard } from "@/components/dashboard/VixCard"
import { FiiDiiCard } from "@/components/dashboard/FiiDiiCard"
import { PreMarketMovers } from "@/components/dashboard/PreMarketMovers"
import { NewsWire } from "@/components/dashboard/NewsWire"
import { BiasResult, NewsItem, PreMarketData } from "@/types"

export default function PreMarketDashboardPage() {
  const [data, setData] = useState<PreMarketData | null>(null)
  const [bias, setBias] = useState<BiasResult | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsSource, setNewsSource] = useState("")
  const [marketError, setMarketError] = useState("")
  const [newsError, setNewsError] = useState("")

  useEffect(() => {
    fetch("/api/dashboard/pre-market", { cache: "no-store" })
      .then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Failed to fetch market data.")
        setData(result.data)
        setBias(result.bias)
      })
      .catch((error: Error) => setMarketError(error.message))

    fetch("/api/dashboard/news", { cache: "no-store" })
      .then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Failed to fetch news.")
        setNews(result.items || [])
        setNewsSource(result.source || "Source unavailable")
      })
      .catch((error: Error) => setNewsError(error.message))
  }, [])

  return (
    <div className="pb-10">
      <PageHeader
        title="Pre-Market Intelligence"
        subtitle="Nifty 50 and volatility from NSE India when available; global indices from Yahoo Finance. Unavailable feeds are labeled as sample data."
        actions={
          <span className="text-[11px] font-semibold text-text-secondary bg-surface-low border border-border px-3 py-1 rounded-full">
            Live data is source-labeled
          </span>
        }
      />

      <div className="p-6 max-w-[1500px] mx-auto space-y-5">
        {marketError && (
          <div role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {marketError}
          </div>
        )}
        {data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <PreMarketCard data={data} />
              <GlobalMarketsRow data={data} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {bias && (
                <BiasCard
                  bias={bias}
                  hasSampleInputs={Object.values(data.sources || {}).includes("Sample")}
                />
              )}
              <VixCard data={data} />
              <FiiDiiCard data={data} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PreMarketMovers movers={data.movers} />
              {newsError ? (
                <div role="alert" className="rounded-xl border border-accent-red/30 bg-accent-red/10 p-5 text-xs text-accent-red">
                  {newsError}
                </div>
              ) : (
                <NewsWire items={news} source={newsSource || "Loading news source…"} />
              )}
            </div>
          </>
        )}
        {!data && !marketError && (
          <p className="rounded-xl border border-border bg-surface-low p-5 text-xs text-text-secondary">
            Loading market data…
          </p>
        )}
      </div>
    </div>
  )
}
