import { NextResponse } from "next/server"
import { getPreMarketTelemetry } from "@/lib/nse"
import { calculateBias } from "@/lib/bias"
import { requirePro } from "@/lib/utils"

export async function GET() {
  try {
    await requirePro()
    const data = await getPreMarketTelemetry()
    const bias = calculateBias(data)
    return NextResponse.json(bias)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (msg === "UPGRADE_REQUIRED") return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    return NextResponse.json({ error: "Failed to compute bias" }, { status: 500 })
  }
}
