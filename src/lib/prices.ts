// src/lib/prices.ts
import { cacheGet, cacheSet } from "./redis"

export interface QuoteItem {
  symbol: string
  sector: string
  ltp: number
  change: number
  changePct: number
  high52w: number
  low52w: number
  volume: string
  source?: "Yahoo Finance" | "Sample"
}

const DEFAULT_QUOTES: Record<string, QuoteItem> = {
  "NIFTY 50": { symbol: "NIFTY 50", sector: "Index", ltp: 24312.15, change: 102.0, changePct: 0.42, high52w: 24853, low52w: 18837, volume: "—" },
  "BANKNIFTY": { symbol: "BANKNIFTY", sector: "Index", ltp: 51348.8, change: 440.0, changePct: 0.86, high52w: 54467, low52w: 39350, volume: "—" },
  "RELIANCE": { symbol: "RELIANCE", sector: "Energy", ltp: 2990.0, change: 24.0, changePct: 0.8, high52w: 3217, low52w: 2220, volume: "4.2M" },
  "HDFCBANK": { symbol: "HDFCBANK", sector: "Banking", ltp: 1642.5, change: 20.0, changePct: 1.2, high52w: 1794, low52w: 1364, volume: "8.1M" },
  "TATASTEEL": { symbol: "TATASTEEL", sector: "Metals", ltp: 154.2, change: 3.2, changePct: 2.1, high52w: 184, low52w: 113, volume: "12.4M" },
  "INFY": { symbol: "INFY", sector: "IT", ltp: 1885.0, change: 28.0, changePct: 1.5, high52w: 1975, low52w: 1310, volume: "3.8M" },
  "WIPRO": { symbol: "WIPRO", sector: "IT", ltp: 492.0, change: -2.0, changePct: -0.4, high52w: 560, low52w: 380, volume: "2.1M" },
  "BHARTIARTL": { symbol: "BHARTIARTL", sector: "Telecom", ltp: 1320.0, change: 15.0, changePct: 1.15, high52w: 1598, low52w: 817, volume: "5.6M" },
  "ICICIBANK": { symbol: "ICICIBANK", sector: "Banking", ltp: 1248.0, change: 14.5, changePct: 1.18, high52w: 1310, low52w: 912, volume: "6.4M" },
  "SBIN": { symbol: "SBIN", sector: "PSU Bank", ltp: 824.5, change: 9.8, changePct: 1.2, high52w: 912, low52w: 555, volume: "11.2M" },
}

export async function fetchYahooQuote(symbol: string): Promise<QuoteItem> {
  const cleanSym = symbol.toUpperCase().trim()
  const cacheKey = `prices:${cleanSym}`
  const cached = await cacheGet<QuoteItem>(cacheKey)
  if (cached) return cached

  const yahooTicker =
    cleanSym === "NIFTY 50" || cleanSym === "NIFTY"
      ? "^NSEI"
      : cleanSym === "BANKNIFTY"
      ? "^NSEBANK"
      : `${cleanSym}.NS`

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=5d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) throw new Error("Yahoo fetch error")
    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    if (meta?.regularMarketPrice) {
      const ltp = Number(meta.regularMarketPrice.toFixed(2))
      const prev = Number((meta.chartPreviousClose || ltp).toFixed(2))
      const change = Number((ltp - prev).toFixed(2))
      const changePct = prev ? Number(((change / prev) * 100).toFixed(2)) : 0
      const item: QuoteItem = {
        symbol: cleanSym,
        sector: DEFAULT_QUOTES[cleanSym]?.sector || "NSE Equity",
        ltp,
        change,
        changePct,
        high52w: Number((meta.fiftyTwoWeekHigh || ltp * 1.12).toFixed(0)),
        low52w: Number((meta.fiftyTwoWeekLow || ltp * 0.78).toFixed(0)),
        volume: meta.regularMarketVolume
          ? `${(meta.regularMarketVolume / 1_000_000).toFixed(1)}M`
          : DEFAULT_QUOTES[cleanSym]?.volume || "1.5M",
        source: "Yahoo Finance",
      }
      await cacheSet(cacheKey, item, 60)
      return item
    }
  } catch {
    // Fallback to deterministic quote below
  }

  const fallback = DEFAULT_QUOTES[cleanSym] || {
    symbol: cleanSym,
    sector: "NSE Equity",
    ltp: 1250.0,
    change: 12.4,
    changePct: 1.0,
    high52w: 1480,
    low52w: 920,
    volume: "2.4M",
  }
  return { ...fallback, source: "Sample" }
}

export async function fetchYahooTickerQuote(
  ticker: string,
  displaySymbol: string
): Promise<QuoteItem | null> {
  const cacheKey = `prices:ticker:${ticker}`
  const cached = await cacheGet<QuoteItem>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const result = (await res.json())?.chart?.result?.[0]
    const meta = result?.meta
    if (!meta?.regularMarketPrice) return null

    const ltp = Number(meta.regularMarketPrice)
    const previousClose = Number(meta.chartPreviousClose || ltp)
    const quote: QuoteItem = {
      symbol: displaySymbol,
      sector: "Index",
      ltp,
      change: Number((ltp - previousClose).toFixed(2)),
      changePct: previousClose
        ? Number((((ltp - previousClose) / previousClose) * 100).toFixed(2))
        : 0,
      high52w: Number(meta.fiftyTwoWeekHigh || ltp),
      low52w: Number(meta.fiftyTwoWeekLow || ltp),
      volume: "—",
      source: "Yahoo Finance",
    }
    await cacheSet(cacheKey, quote, 60)
    return quote
  } catch {
    return null
  }
}

export async function fetchBatchQuotes(symbols: string[]): Promise<Record<string, QuoteItem>> {
  const results: Record<string, QuoteItem> = {}
  await Promise.all(
    symbols.map(async (sym) => {
      results[sym] = await fetchYahooQuote(sym)
    })
  )
  return results
}
