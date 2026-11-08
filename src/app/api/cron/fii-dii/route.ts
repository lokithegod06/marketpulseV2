import { NextRequest, NextResponse } from "next/server"
import { getPreMarketTelemetry } from "@/lib/nse"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
  }
  const telemetry = await getPreMarketTelemetry()
  return NextResponse.json({ status: "FII/DII daily archive synced", netCashInflow: telemetry.netCashInflow })
}
