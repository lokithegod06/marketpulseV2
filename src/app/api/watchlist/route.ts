import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { fetchBatchQuotes } from "@/lib/prices"
import type { QuoteItem } from "@/lib/prices"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

export async function GET() {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const maxLimit = user.plan === "PRO" ? 20 : 10

  const items = await db.watchlistItem.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  })
  const symbols = items.map((i) => i.symbol)

  const quotes: Record<string, QuoteItem | undefined> = symbols.length
    ? await fetchBatchQuotes(symbols)
    : {}
  return NextResponse.json({
    items: symbols.map((sym) => quotes[sym]).filter(Boolean),
    limit: maxLimit,
    slotsRemaining: Math.max(0, maxLimit - symbols.length),
  })
}

export async function POST(req: NextRequest) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const maxLimit = user.plan === "PRO" ? 20 : 10
  const body = await req.json()
  const symbol = String(body.symbol || "").toUpperCase().trim()
  if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 })
  if (!/^[A-Z0-9&.-]{1,30}$/.test(symbol)) {
    return NextResponse.json({ error: "Enter a valid NSE stock symbol." }, { status: 400 })
  }

  const existing = await db.watchlistItem.findUnique({
    where: { userId_symbol: { userId: user.id, symbol } },
  })
  const count = existing ? 0 : await db.watchlistItem.count({ where: { userId: user.id } })
  if (!existing && count >= maxLimit) {
    return NextResponse.json(
      { error: `Watchlist limit (${maxLimit} stocks) reached for ${user.plan} tier.` },
      { status: 403 }
    )
  }

  const quotes = await fetchBatchQuotes([symbol])
  const quote = quotes[symbol]
  if (quote?.source !== "Yahoo Finance") {
    return NextResponse.json(
      { error: `Could not verify ${symbol} with Yahoo Finance. Check the NSE symbol and try again.` },
      { status: 422 }
    )
  }

  const record =
    existing ??
    (await db.watchlistItem.create({
      data: { userId: user.id, symbol, exchange: "NSE", sortOrder: count },
    }))
  return NextResponse.json(
    { item: quote, dbRecord: record },
    { status: existing ? 200 : 201 }
  )
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get("symbol")?.toUpperCase()
  if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 })

  await db.watchlistItem.deleteMany({
    where: { userId: user.id, symbol },
  })
  return NextResponse.json({ deleted: true, symbol })
}
