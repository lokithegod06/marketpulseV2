// src/lib/bias.ts
// Section 15.4: Market Pulse Bias Algorithm (NOT AI — Rule-Based)
import { BiasPivots, BiasResult, PreMarketData } from "@/types"

export function calculatePivots(spotClose: number): BiasPivots {
  const step = Math.round((spotClose * 0.0025) / 10) * 10 || 50
  const base = Math.round(spotClose / 50) * 50
  return {
    r1: base + 50,
    r2: base + 50 + step,
    s1: base - 100,
    s2: base - 180,
  }
}

export function generateReasoning(data: PreMarketData, bullPct: number): string {
  const dirWord = bullPct >= 60 ? "sustained above key support" : bullPct <= 40 ? "showing pre-open weakness" : "trading within a balanced consolidation band"
  const flowWord =
    data.diiCash === null
      ? "institutional cash-flow data unavailable"
      : data.diiCash > 1000
        ? `aggressive DII cash buying (₹${data.diiCash.toLocaleString("en-IN")} Cr)`
        : `DII cash flow of ₹${data.diiCash.toLocaleString("en-IN")} Cr`
  const outcomeWord =
    bullPct >= 60
      ? "support a gap-up opening for Nifty & BankNifty."
      : bullPct <= 40
      ? "warrant caution on aggressive long setups at open."
      : "favor range-bound straddle and VWAP reversion setups."

  const indexCue = data.giftNiftyQuote
    ? `GIFT Nifty ${data.giftNiftyQuote.changePct >= 0 ? "+" : ""}${data.giftNiftyQuote.changePct.toFixed(2)}%`
    : `Nifty 50 spot proxy ${data.giftNiftyChange >= 0 ? "+" : ""}${data.giftNiftyChange.toFixed(2)}% (GIFT Nifty quote unavailable)`
  return `${indexCue} ${dirWord} alongside ${flowWord}. Global cues (Dow ${data.dowChange >= 0 ? "+" : ""}${data.dowChange.toFixed(2)}%, VIX at ${data.vix.toFixed(2)}) ${outcomeWord}`
}

export function calculateBias(data: PreMarketData): BiasResult {
  let bullScore = 0
  let bearScore = 0

  // Use GIFT Nifty when available; otherwise use the labeled Nifty spot proxy.
  const indexChange = data.giftNiftyQuote?.changePct ?? data.giftNiftyChange
  if (indexChange > 0.3) bullScore += 25
  else if (indexChange > 0) bullScore += 10
  else if (indexChange < -0.3) bearScore += 25
  else bearScore += 10

  // Rule 2: Dow Jones previous close
  if (data.dowChange > 0.5) bullScore += 20
  else if (data.dowChange > 0) bullScore += 8
  else if (data.dowChange < -0.5) bearScore += 20
  else bearScore += 8

  // Rule 3: India VIX
  if (data.vix < 13) bullScore += 15 // Low fear = good for writers
  else if (data.vix > 18) bearScore += 20
  else bullScore += 5

  // Rule 4: DII Cash Flow
  if (data.diiCash !== null) {
    if (data.diiCash > 1000) bullScore += 20
    else if (data.diiCash > 0) bullScore += 8
    else bearScore += 15
  }

  // Use reported FII cash flows; futures positioning is not supplied by this source.
  if (data.fiiCash !== null) {
    if (data.fiiCash > 1000) bullScore += 20
    else if (data.fiiCash < -1000) bearScore += 20
  }

  const total = bullScore + bearScore || 1
  const bullPct = Math.round((bullScore / total) * 100)

  return {
    bias: bullPct >= 60 ? "BULLISH" : bullPct <= 40 ? "BEARISH" : "NEUTRAL",
    bullPercent: bullPct,
    reasoning: generateReasoning(data, bullPct),
    pivots: calculatePivots(data.giftNiftyClose || data.giftNiftyPrice),
  }
}
