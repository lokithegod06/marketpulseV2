// src/lib/nse.ts
import { cacheGet, cacheSet } from "./redis"
import { fetchYahooTickerQuote } from "./prices"
import { PreMarketData } from "@/types"

export async function fetchNSE(path: string) {
  let cookies = await cacheGet<string>("nse:cookie")

  if (!cookies) {
    const cookieRes = await fetch("https://www.nseindia.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    })
    cookies = cookieRes.headers.get("set-cookie") || ""
    if (cookies) {
      await cacheSet("nse:cookie", cookies, 1800) // Cache cookie for 30 min
    }
  }

  const res = await fetch(`https://www.nseindia.com${path}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.nseindia.com/",
      "Cookie": cookies,
    },
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`NSE API error: ${res.status}`)
  return res.json()
}

export const FALLBACK_PREMARKET_DATA: PreMarketData = {
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
  fiiCash: -412.5,
  fiiFutures: 12450,
  diiCash: 2845.2,
  diiFutures: 4110,
  netCashInflow: 2432.7,
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

export async function getPreMarketTelemetry(): Promise<PreMarketData> {
  const dateKey = `pre-market:${new Date().toISOString().split("T")[0]}`
  const cached = await cacheGet<PreMarketData>(dateKey)
  if (cached?.sources) return cached

  let indicesData: { data?: {
    index?: string
    last?: number
    percentChange?: number
    variation?: number
    dayHigh?: number
    dayLow?: number
  }[] } | null = null
  try {
    indicesData = await fetchNSE("/api/allIndices")
  } catch {
    indicesData = null
  }

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
        institutionalFlows: "Sample",
        movers: "Sample",
      },
    }
    await cacheSet(dateKey, liveData, 60)
    return liveData
  } catch {
    return {
      ...FALLBACK_PREMARKET_DATA,
      sources: {
        nifty: "Sample",
        vix: "Sample",
        dow: "Sample",
        sp500: "Sample",
        nikkei: "Sample",
        institutionalFlows: "Sample",
        movers: "Sample",
      },
    }
  }
}
