import { NextResponse } from "next/server"
import { getPreMarketTelemetry } from "@/lib/nse"
import { calculateBias } from "@/lib/bias"

export async function GET() {
  try {
    const data = await getPreMarketTelemetry()
    const bias = calculateBias(data)
    return NextResponse.json({
      data,
      bias,
      sources: data.sources,
      cachedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch pre-market data", detail: String(err) }, { status: 500 })
  }
}
