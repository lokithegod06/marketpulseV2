import { NextRequest, NextResponse } from "next/server"
import { BUILTIN_SCREENER_RESULTS, runChartinkScan } from "@/lib/chartink"
import { SCREENER_CATALOG } from "@/lib/screener-catalog"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionOrDemoUser()
    const body = await req.json()
    const screenerId = String(body.screenerId || "")
    const screener = SCREENER_CATALOG.find((item) => item.id === screenerId)
    if (!screener) {
      return NextResponse.json({ error: "Screener is not available." }, { status: 404 })
    }

    if (screener.isPro && user.plan !== "PRO") {
      return NextResponse.json(
        { error: "Pro subscription required for deep-filter ChartInk screeners" },
        { status: 403 }
      )
    }

    const results = screener.isPro
      ? await runChartinkScan(screenerId)
      : BUILTIN_SCREENER_RESULTS[screenerId]

    return NextResponse.json({
      screenerId,
      isPro: screener.isPro,
      source: screener.isPro ? "ChartInk (sample fallback possible)" : "Sample data",
      results,
      cachedAt: new Date().toISOString(),
    })
  } catch (err) {
    const status = err instanceof Error && err.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Screener execution failed", detail: String(err) }, { status })
  }
}
