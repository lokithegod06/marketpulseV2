import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db, isDatabaseConfigured } from "@/lib/db"
import { fetchBatchQuotes } from "@/lib/prices"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

const HoldingSchema = z.object({
  symbol: z.string().min(1),
  exchange: z.string().default("NSE"),
  buyPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
})

export async function GET() {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }
    const dbHoldings = await db.holding.findMany({ where: { userId: user.id } })
    if (dbHoldings.length === 0) {
      return NextResponse.json({ holdings: [] })
    }
    const quotes = await fetchBatchQuotes(dbHoldings.map((h) => h.symbol))
    const enriched = dbHoldings.map((h) => {
      const q = quotes[h.symbol.toUpperCase()]
      return {
        id: h.id,
        symbol: h.symbol,
        sector: q?.sector || "Equity",
        exchange: h.exchange,
        quantity: h.quantity,
        buyPrice: Number(h.buyPrice),
        currentPrice: q?.ltp || Number(h.buyPrice),
        dayChangePct: q?.changePct || 0,
      }
    })
    return NextResponse.json({ holdings: enriched })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR"
    const status = msg === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to fetch holdings", detail: msg }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }
    const body = await req.json()
    const parsed = HoldingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const holding = await db.holding.create({
      data: {
        userId: user.id,
        symbol: parsed.data.symbol.toUpperCase(),
        exchange: parsed.data.exchange,
        buyPrice: parsed.data.buyPrice,
        quantity: parsed.data.quantity,
        notes: parsed.data.notes,
      },
    })
    return NextResponse.json({ holding }, { status: 201 })
  } catch (err) {
    const status = err instanceof Error && err.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to add holding", detail: String(err) }, { status })
  }
}
