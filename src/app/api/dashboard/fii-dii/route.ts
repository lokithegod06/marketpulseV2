import { NextResponse } from "next/server"
import { getPreMarketTelemetry } from "@/lib/nse"
import { requirePro } from "@/lib/utils"

export async function GET() {
  try {
    await requirePro()
    const data = await getPreMarketTelemetry()
    return NextResponse.json({
      fiiCash: data.fiiCash,
      diiCash: data.diiCash,
      netCashInflow: data.netCashInflow,
      date: data.institutionalFlowsDate,
      source: data.sources?.institutionalFlows ?? "Unavailable",
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (msg === "UPGRADE_REQUIRED") return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    return NextResponse.json({ error: "Failed to fetch FII/DII data" }, { status: 500 })
  }
}
