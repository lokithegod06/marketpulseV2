import { NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { fetchBatchQuotes } from "@/lib/prices"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

export async function GET() {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }

    const holdings = await db.holding.findMany({
      where: { userId: user.id },
      select: { symbol: true, quantity: true },
    })
    if (holdings.length === 0) {
      return NextResponse.json({ dayPnl: 0, source: "portfolio" })
    }

    const symbols = Array.from(new Set(holdings.map((holding) => holding.symbol)))
    const quotes = await fetchBatchQuotes(symbols)
    const unavailable = holdings
      .filter((holding) => quotes[holding.symbol]?.source !== "Yahoo Finance")
      .map((holding) => holding.symbol)
    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: "Live quote unavailable for one or more holdings.", symbols: unavailable },
        { status: 503 }
      )
    }

    const dayPnl = holdings.reduce(
      (total, holding) => total + quotes[holding.symbol].change * holding.quantity,
      0
    )
    return NextResponse.json({ dayPnl, source: "portfolio" })
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to calculate portfolio day P&L." }, { status })
  }
}
