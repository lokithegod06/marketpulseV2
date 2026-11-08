import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db, isDatabaseConfigured } from "@/lib/db"
import { checkDisciplineRules } from "@/lib/discipline"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

const TradeSchema = z.object({
  symbol: z.string().min(1),
  direction: z.enum(["BUY", "SELL"]),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  quantity: z.number().int().positive(),
  lots: z.number().int().positive().optional(),
  strategyTag: z.string().optional(),
  disciplineChecks: z.array(
    z.object({
      label: z.string(),
      checked: z.boolean(),
    })
  ),
  notes: z.string().optional(),
})

const DEMO_TRADES = [
  {
    id: "trade-1",
    date: "2026-11-05T09:22:00.000Z",
    time: "09:22 AM",
    symbol: "BANKNIFTY 51200 CE",
    exchange: "NSE",
    direction: "BUY" as const,
    entryPrice: 245.5,
    exitPrice: 310.0,
    quantity: 300,
    lots: 4,
    strategyTag: "ORB Breakout",
    disciplineChecks: [
      { label: "Followed pre-defined hard stop loss", checked: true },
      { label: "Confirmed candle close before execution", checked: true },
      { label: "Position sized safely within portfolio limits", checked: true },
    ],
    notes: "Clean retest of 51,000 call strike open interest buildup. Exited precisely at R2 target with patience.",
    pnl: 19350,
    isOpen: false,
  },
  {
    id: "trade-2",
    date: "2026-11-05T10:15:00.000Z",
    time: "10:15 AM",
    symbol: "NIFTY 24800 PE",
    exchange: "NSE",
    direction: "BUY" as const,
    entryPrice: 116.0,
    exitPrice: 149.0,
    quantity: 400,
    lots: 8,
    strategyTag: "VWAP Fade",
    disciplineChecks: [
      { label: "Followed pre-defined hard stop loss", checked: true },
      { label: "Confirmed candle close before execution", checked: true },
      { label: "Position sized safely within portfolio limits", checked: true },
    ],
    notes: "Rejection from VWAP band with rising PE OI.",
    pnl: 13200,
    isOpen: false,
  },
  {
    id: "trade-3",
    date: "2026-11-05T11:40:00.000Z",
    time: "11:40 AM",
    symbol: "TATASTEEL EQ",
    exchange: "NSE",
    direction: "BUY" as const,
    entryPrice: 151.0,
    exitPrice: 171.2,
    quantity: 500,
    lots: 1,
    strategyTag: "Swing Pullback",
    disciplineChecks: [
      { label: "Followed pre-defined hard stop loss", checked: true },
      { label: "Confirmed candle close before execution", checked: true },
    ],
    notes: "Metals sector breakout with 2.8x relative volume.",
    pnl: 10100,
    isOpen: false,
  },
  {
    id: "trade-4",
    date: "2026-11-05T13:18:00.000Z",
    time: "01:18 PM",
    symbol: "NIFTY 24980 CE",
    exchange: "NSE",
    direction: "BUY" as const,
    entryPrice: 88.0,
    exitPrice: 74.0,
    quantity: 300,
    lots: 6,
    strategyTag: "Momentum Chasing",
    disciplineChecks: [
      { label: "Followed pre-defined hard stop loss", checked: true },
      { label: "Did not enter during midday chop (11:30–1:15 PM)", checked: false },
    ],
    notes: "Entered during midday chop transition.",
    pnl: -4200,
    isOpen: false,
  },
]

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") || 30)
    const offset = Number(searchParams.get("offset") || 0)

    const trades = await db.trade.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ trades })
  } catch (err) {
    const status = err instanceof Error && err.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to fetch trades", detail: String(err) }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }

    const body = await req.json()
    const parsed = TradeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    // Compute P&L if exit price provided
    const pnl = data.exitPrice
      ? data.direction === "BUY"
        ? (data.exitPrice - data.entryPrice) * data.quantity
        : (data.entryPrice - data.exitPrice) * data.quantity
      : null

    const trade = await db.trade.create({
      data: {
        userId: user.id,
        symbol: data.symbol,
        direction: data.direction,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        quantity: data.quantity,
        lots: data.lots,
        strategyTag: data.strategyTag,
        disciplineChecks: data.disciplineChecks,
        notes: data.notes,
        pnl,
        isOpen: !data.exitPrice,
      },
    })

    // Check discipline rules and update score
    await checkDisciplineRules(user.id, trade)

    return NextResponse.json({ trade }, { status: 201 })
  } catch (err) {
    const status = err instanceof Error && err.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to log trade", detail: String(err) }, { status })
  }
}
