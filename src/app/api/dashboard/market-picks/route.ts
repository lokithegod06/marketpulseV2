import { NextResponse } from "next/server"
import { getMarketHotPicks } from "@/lib/market-picks"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function GET() {
  try {
    await getSessionOrDemoUser()
    const [morning, evening] = await Promise.all([
      getMarketHotPicks("MORNING"),
      getMarketHotPicks("EVENING"),
    ])
    return NextResponse.json({ morning, evening }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "UNAUTHORIZED"
    return NextResponse.json(
      { error: unauthorized ? "Please sign in to view market picks." : "Failed to load market picks." },
      { status: unauthorized ? 401 : 500 }
    )
  }
}
