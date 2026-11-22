// src/lib/nse.ts
import { cacheGet, cacheSet } from "./redis"
import { fetchGiftNiftyQuote, fetchYahooTickerQuote } from "./prices"
import { PreMarketData } from "@/types"

const NSE_REQUEST_TIMEOUT_MS = 5000
let nseCookieRequest: Promise<string> | null = null

function normalizeCookies(setCookieHeader: string): string {
  return setCookieHeader
    .split(/,(?=\s*[^;,]+=)/)
    .map((cookie) => cookie.split(";")[0].trim())
    .filter(Boolean)
    .join("; ")
}

async function getNseCookies(): Promise<string> {
  const cached = await cacheGet<string>("nse:cookie")
  if (cached) return normalizeCookies(cached)

  if (!nseCookieRequest) {
    nseCookieRequest = (async () => {
      const response = await fetch("https://www.nseindia.com", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(NSE_REQUEST_TIMEOUT_MS),
        cache: "no-store",
      })
      if (!response.ok) throw new Error(`NSE session request returned ${response.status}`)

      const cookies = normalizeCookies(response.headers.get("set-cookie") || "")
      if (cookies) await cacheSet("nse:cookie", cookies, 1800)
      return cookies
    })()
    nseCookieRequest.then(
      () => {
        nseCookieRequest = null
      },
      () => {
        nseCookieRequest = null
      }
    )
  }

  return nseCookieRequest
}

export async function fetchNSE(path: string) {
  const cookieHeader = await getNseCookies()
  const res = await fetch(`https://www.nseindia.com${path}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.nseindia.com/",
      "Cookie": cookieHeader,
    },
    signal: AbortSignal.timeout(NSE_REQUEST_TIMEOUT_MS),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`NSE API error: ${res.status}`)
  return res.json()
}

type FiiDiiCashFlows = {
  fiiCash: number | null
  diiCash: number | null
  netCashInflow: number | null
  date: string | null
  source: "NSE India" | "Unavailable"
}

const UNAVAILABLE_FII_DII: FiiDiiCashFlows = {
  fiiCash: null,
  diiCash: null,
  netCashInflow: null,
  date: null,
  source: "Unavailable",
}

function parseFlowValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value !== "string") return null
  const parsed = Number(value.replace(/,/g, "").trim())
  return Number.isFinite(parsed) ? parsed : null
}

export async function getFiiDiiCashFlows(): Promise<FiiDiiCashFlows> {
  const cacheKey = `fii-dii-cash:${new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())}`
  const cached = await cacheGet<FiiDiiCashFlows>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetchNSE("/api/fiidiiTradeReact")
    const rows: Array<{ category?: unknown; netValue?: unknown; date?: unknown }> = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : []
    const fii = rows.find((row) =>
      typeof row.category === "string" && /fii|fpi/i.test(row.category)
    )
    const dii = rows.find((row) =>
      typeof row.category === "string" && /^dii$/i.test(row.category)
    )
    const fiiNet = parseFlowValue(fii?.netValue)
    const diiNet = parseFlowValue(dii?.netValue)
    if (fiiNet === null || diiNet === null) {
      throw new Error("NSE returned incomplete FII/DII cash-flow rows")
    }

    const result: FiiDiiCashFlows = {
      fiiCash: fiiNet,
      diiCash: diiNet,
      netCashInflow: fiiNet + diiNet,
      date: String(fii?.date || dii?.date || "") || null,
      source: "NSE India",
    }
    await cacheSet(cacheKey, result, 600)
    return result
  } catch (error) {
    console.warn(
      "NSE FII/DII data unavailable:",
      error instanceof Error ? error.message : String(error)
    )
    await cacheSet(cacheKey, UNAVAILABLE_FII_DII, 300)
    return UNAVAILABLE_FII_DII
  }
}

export const FALLBACK_PREMARKET_DATA: PreMarketData = {
  giftNiftyQuote: null,
  giftNiftyPrice: 24910.5,
  giftNiftyChange: 0.58,
  giftNiftyChangePts: 142.3,
  giftNiftyHigh: 24945.0,
  giftNiftyLow: 24780.2,
  giftNiftyOiNet: "+8.4% Long",
  giftNiftyClose: 24900.0,
  dowPrice: 40834.97,
  dowChange: 0.6,
  dowChangePts: 243.6,
  dowStatus: "Closed",
  sp500Price: 5592.18,
  sp500Change: 0.76,
  sp500ChangePts: 42.1,
  sp500Status: "Closed",
  nikkeiPrice: 38362.53,
  nikkeiChange: 0.82,
  nikkeiChangePts: 310.8,
  nikkeiStatus: "Live",
  vix: 12.45,
  vixChange: -4.23,
  vixChangePts: -0.55,
  vixPercentile: 18,
  vixLabel: "Low",
  fiiCash: null,
  diiCash: null,
  netCashInflow: null,
  institutionalFlowsDate: null,
  movers: [
    {
      symbol: "TATASTEEL",
      sector: "Metals",
      price: 154.2,
      gapPct: 2.1,
      volumeMultiple: "2.8x",
      catalyst: "Global Steel Rebound",
    },
    {
      symbol: "HDFCBANK",
      sector: "Banking",
      price: 1642.5,
      gapPct: 1.2,
      volumeMultiple: "1.9x",
      catalyst: "DII Block Flow",
    },
    {
      symbol: "RELIANCE",
      sector: "Energy",
      price: 2990.0,
      gapPct: 0.8,
      volumeMultiple: "1.4x",
      catalyst: "Crude Softening",
    },
    {
      symbol: "INFY",
      sector: "IT Services",
      price: 1885.0,
      gapPct: 1.5,
      volumeMultiple: "2.2x",
      catalyst: "Europe Cloud Deal",
    },
  ],
}

let preMarketRequest: Promise<PreMarketData> | null = null

export function getPreMarketTelemetry(): Promise<PreMarketData> {
  if (preMarketRequest) return preMarketRequest

  const request = loadPreMarketTelemetry()
  preMarketRequest = request
  request.then(
    () => {
      if (preMarketRequest === request) preMarketRequest = null
    },
    () => {
      if (preMarketRequest === request) preMarketRequest = null
    }
  )
  return request
}

async function loadPreMarketTelemetry(): Promise<PreMarketData> {
  const dateKey = `pre-market:${new Date().toISOString().split("T")[0]}`
  const cached = await cacheGet<PreMarketData>(dateKey)
  if (cached?.sources) return cached

  const indicesPromise: Promise<{ data?: {
    index?: string
    last?: number
    percentChange?: number
    variation?: number
    dayHigh?: number
    dayLow?: number
  }[] } | null> = fetchNSE("/api/allIndices").catch((error) => {
    console.warn(
      "NSE index data unavailable:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  })

  const [giftNiftyQuote, fiiDiiFlows, indicesData] = await Promise.all([
    fetchGiftNiftyQuote().catch((error) => {
      console.error("GIFT Nifty quote fetch failed:", error)
      return null
    }),
    getFiiDiiCashFlows(),
    indicesPromise,
  ])

  try {
    const vixRow = indicesData?.data?.find(
      (item: { index?: string }) => item.index === "INDIA VIX"
    )
    const niftyRow = indicesData?.data?.find(
      (item: { index?: string }) => item.index === "NIFTY 50"
    )
    const [dow, sp500, nikkei] = await Promise.all([
      fetchYahooTickerQuote("^DJI", "Dow Jones"),
      fetchYahooTickerQuote("^GSPC", "S&P 500"),
      fetchYahooTickerQuote("^N225", "Nikkei 225"),
    ])
    const liveData: PreMarketData = {
      ...FALLBACK_PREMARKET_DATA,
      giftNiftyQuote,
      ...fiiDiiFlows,
      institutionalFlowsDate: fiiDiiFlows.date,
      giftNiftyPrice: niftyRow?.last ?? FALLBACK_PREMARKET_DATA.giftNiftyPrice,
      giftNiftyChange: niftyRow?.percentChange ?? FALLBACK_PREMARKET_DATA.giftNiftyChange,
      giftNiftyChangePts: niftyRow?.variation ?? FALLBACK_PREMARKET_DATA.giftNiftyChangePts,
      giftNiftyHigh: niftyRow?.dayHigh ?? FALLBACK_PREMARKET_DATA.giftNiftyHigh,
      giftNiftyLow: niftyRow?.dayLow ?? FALLBACK_PREMARKET_DATA.giftNiftyLow,
      giftNiftyClose:
        niftyRow?.last && niftyRow?.variation !== undefined
          ? niftyRow.last - niftyRow.variation
          : FALLBACK_PREMARKET_DATA.giftNiftyClose,
      vix: vixRow?.last ?? FALLBACK_PREMARKET_DATA.vix,
      vixChange: vixRow?.percentChange ?? FALLBACK_PREMARKET_DATA.vixChange,
      vixChangePts: vixRow?.variation ?? FALLBACK_PREMARKET_DATA.vixChangePts,
      ...(dow && {
        dowPrice: dow.ltp,
        dowChange: dow.changePct,
        dowChangePts: dow.change,
      }),
      ...(sp500 && {
        sp500Price: sp500.ltp,
        sp500Change: sp500.changePct,
        sp500ChangePts: sp500.change,
      }),
      ...(nikkei && {
        nikkeiPrice: nikkei.ltp,
        nikkeiChange: nikkei.changePct,
        nikkeiChangePts: nikkei.change,
      }),
      sources: {
        nifty: niftyRow?.last ? "NSE India" : "Sample",
        vix: vixRow?.last ? "NSE India" : "Sample",
        dow: dow ? "Yahoo Finance" : "Sample",
        sp500: sp500 ? "Yahoo Finance" : "Sample",
        nikkei: nikkei ? "Yahoo Finance" : "Sample",
        institutionalFlows: fiiDiiFlows.source,
        movers: "Sample",
      },
    }
    await cacheSet(dateKey, liveData, 60)
    return liveData
  } catch {
    return {
      ...FALLBACK_PREMARKET_DATA,
      giftNiftyQuote,
      ...fiiDiiFlows,
      institutionalFlowsDate: fiiDiiFlows.date,
      sources: {
        nifty: "Sample",
        vix: "Sample",
        dow: "Sample",
        sp500: "Sample",
        nikkei: "Sample",
        institutionalFlows: fiiDiiFlows.source,
        movers: "Sample",
      },
    }
  }
}
