import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const body = await req.json()
  const updated = await db.holding.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      buyPrice: body.buyPrice,
      quantity: body.quantity,
      notes: body.notes,
    },
  })
  return NextResponse.json({ updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  await db.holding.deleteMany({
    where: { id: params.id, userId: user.id },
  })
  return NextResponse.json({ deleted: true })
}
