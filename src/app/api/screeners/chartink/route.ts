import { NextRequest, NextResponse } from "next/server"
import { runChartinkScan } from "@/lib/chartink"
import { requirePro } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    await requirePro()
    const { searchParams } = new URL(req.url)
    const scanKey = searchParams.get("scan") || "deepOIPCR"
    const results = await runChartinkScan(scanKey)
    return NextResponse.json({ scanKey, results, cachedAt: new Date().toISOString() })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR"
    if (msg === "UPGRADE_REQUIRED") return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    return NextResponse.json(
      { error: "Data unavailable — ChartInk connection error", lastFetch: new Date().toISOString() },
      { status: 503 }
    )
  }
}
