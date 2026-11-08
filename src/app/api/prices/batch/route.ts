import { NextRequest, NextResponse } from "next/server"
import { fetchBatchQuotes } from "@/lib/prices"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const symbols: string[] = Array.isArray(body.symbols)
      ? body.symbols
      : ["NIFTY 50", "BANKNIFTY", "RELIANCE", "HDFCBANK", "TATASTEEL", "INFY"]
    const prices = await fetchBatchQuotes(symbols)
    return NextResponse.json({ prices, timestamp: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ error: "Batch price fetch failed", detail: String(err) }, { status: 500 })
  }
}
