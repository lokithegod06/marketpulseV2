import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionOrDemoUser()
  const body = await req.json()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ rule: { id: params.id, ...body } })
  }
  const updated = await db.disciplineRule.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      label: body.label,
      description: body.description,
      isActive: body.isActive,
      penaltyPoints: body.penaltyPoints,
    },
  })
  return NextResponse.json({ updated })
}
