import { NextRequest, NextResponse } from "next/server"
import { generateMarketHotPicks } from "@/lib/market-picks"

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 })
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger." }, { status: 401 })
  }

  try {
    const digest = await generateMarketHotPicks("MORNING")
    return NextResponse.json({ generated: true, session: digest.session, count: digest.items.length })
  } catch (error) {
    console.error("Morning market picks cron failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate morning picks." },
      { status: 502 }
    )
  }
}
