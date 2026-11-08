import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const trade = await db.trade.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ trade })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const body = await req.json()
  const existing = await db.trade.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const entry = Number(body.entryPrice ?? existing.entryPrice)
  const exit = body.exitPrice !== undefined ? Number(body.exitPrice) : existing.exitPrice ? Number(existing.exitPrice) : null
  const qty = Number(body.quantity ?? existing.quantity)
  const dir = body.direction ?? existing.direction
  const pnl = exit !== null ? (dir === "BUY" ? (exit - entry) * qty : (entry - exit) * qty) : null

  const updated = await db.trade.update({
    where: { id: params.id },
    data: {
      exitPrice: exit,
      postTradeNotes: body.postTradeNotes ?? existing.postTradeNotes,
      notes: body.notes ?? existing.notes,
      pnl,
      isOpen: exit === null,
    },
  })
  return NextResponse.json({ trade: updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  await db.trade.deleteMany({
    where: { id: params.id, userId: user.id },
  })
  return NextResponse.json({ deleted: true })
}
